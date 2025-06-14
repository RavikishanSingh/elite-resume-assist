
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { accessToken } = await req.json()

    if (!accessToken) {
      throw new Error('LinkedIn access token is required')
    }

    console.log('Fetching LinkedIn profile data...')

    // Fetch basic profile information
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    if (!profileResponse.ok) {
      const error = await profileResponse.text()
      console.error('LinkedIn profile API error:', error)
      throw new Error(`Failed to fetch LinkedIn profile: ${profileResponse.status}`)
    }

    const profileData = await profileResponse.json()
    console.log('LinkedIn profile data:', profileData)

    // Fetch email address
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    let emailData = null
    if (emailResponse.ok) {
      emailData = await emailResponse.json()
      console.log('LinkedIn email data:', emailData)
    }

    // Fetch position information
    const positionsResponse = await fetch('https://api.linkedin.com/v2/positions?q=person&person=urn:li:person:' + profileData.id + '&projection=(elements*(id,title,companyName,summary,startDate,endDate,company(name)))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    let positionsData = null
    if (positionsResponse.ok) {
      positionsData = await positionsResponse.json()
      console.log('LinkedIn positions data:', positionsData)
    }

    // Format the data for our application
    const formattedData = {
      personalInfo: {
        fullName: `${profileData.firstName?.localized?.en_US || ''} ${profileData.lastName?.localized?.en_US || ''}`.trim(),
        email: emailData?.elements?.[0]?.['handle~']?.emailAddress || '',
        phone: '',
        location: '',
        linkedIn: `https://linkedin.com/in/${profileData.id}`,
        portfolio: '',
        summary: ''
      },
      experience: positionsData?.elements?.map((position: any) => ({
        jobTitle: position.title || '',
        company: position.companyName || position.company?.name || '',
        location: '',
        startDate: position.startDate?.year?.toString() || '',
        endDate: position.endDate?.year?.toString() || '',
        current: !position.endDate,
        description: position.summary || ''
      })) || [],
      education: [],
      projects: [],
      skills: []
    }

    // Store the LinkedIn profile data in the database
    const { error: insertError } = await supabaseClient
      .from('linkedin_profiles')
      .insert({
        user_id: user.id,
        linkedin_id: profileData.id,
        raw_data: {
          profile: profileData,
          email: emailData,
          positions: positionsData
        },
        personal_info: formattedData.personalInfo,
        experience: formattedData.experience,
        education: formattedData.education,
        skills: formattedData.skills,
        projects: formattedData.projects
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw new Error('Failed to store LinkedIn profile data')
    }

    console.log('LinkedIn profile imported successfully')

    return new Response(
      JSON.stringify({ success: true, data: formattedData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('LinkedIn import error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
