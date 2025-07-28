import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

interface EmailRequest {
  formData: {
    name: string
    email: string
    phone: string
    location: string
    serviceType: string
    preferredDate?: string
    message: string
  }
}

serve(async (req) => {
  console.log('Email notification function called')

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { formData }: EmailRequest = await req.json()
    console.log('Form data received:', formData)

    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY not found')
      throw new Error('Brevo API key not configured')
    }

    // Format service type for display
    const serviceTypeDisplay = formData.serviceType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Format location for display
    const locationDisplay = formData.location === 'other' 
      ? 'Other (see message)' 
      : formData.location
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    // Email to business owner - using verified sender
    const businessEmailData = {
      sender: {
        name: "Local Errands Website",
        email: "titanbusinesspros@gmail.com"
      },
      to: [{
        email: "traxispathfinder@gmail.com",
        name: "Local Errands Team"
      }],
      subject: `New Service Request from ${formData.name}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">New Service Request</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Local Errands Oklahoma</p>
            </div>
            
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Customer Information</h2>
              <div style="display: grid; gap: 10px;">
                <div><strong>Name:</strong> ${formData.name}</div>
                <div><strong>Email:</strong> ${formData.email}</div>
                <div><strong>Phone:</strong> ${formData.phone}</div>
                <div><strong>Location:</strong> ${locationDisplay}</div>
              </div>
            </div>

            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">Service Details</h2>
              <div style="display: grid; gap: 10px;">
                <div><strong>Service Type:</strong> ${serviceTypeDisplay}</div>
                ${formData.preferredDate ? `<div><strong>Preferred Date/Time:</strong> ${new Date(formData.preferredDate).toLocaleString()}</div>` : ''}
              </div>
            </div>

            <div style="background-color: #fefce8; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h2 style="color: #a16207; margin: 0 0 15px 0; font-size: 18px;">Message</h2>
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.5;">${formData.message}</p>
            </div>

            <div style="text-align: center; padding: 20px; background-color: #f3f4f6; border-radius: 6px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <strong>Next Steps:</strong> Contact the customer within 2 hours during business hours (8 AM - 8 PM)
              </p>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
                Form submitted on ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `
    }

    // Send email to business
    console.log('Sending email to business...')
    const businessResponse = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(businessEmailData)
    })

    const businessResult = await businessResponse.json()
    console.log('Business email response:', businessResult)

    if (!businessResponse.ok) {
      console.error('Failed to send business email:', businessResult)
      throw new Error(`Failed to send business notification: ${businessResult.message || 'Unknown error'}`)
    }

    // Confirmation email to customer - using verified sender
    const customerEmailData = {
      sender: {
        name: "Local Errands Oklahoma",
        email: "titanbusinesspros@gmail.com"
      },
      to: [{
        email: formData.email,
        name: formData.name
      }],
      subject: "Service Request Received - Local Errands Oklahoma",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">Request Received!</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Local Errands Oklahoma</p>
            </div>
            
            <div style="background-color: #dcfce7; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center;">
              <h2 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">Thank you, ${formData.name}!</h2>
              <p style="color: #166534; margin: 0; font-size: 16px;">
                We've received your service request and will contact you within 2 hours during business hours.
              </p>
            </div>

            <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Your Request Details</h2>
              <div style="display: grid; gap: 10px;">
                <div><strong>Service:</strong> ${serviceTypeDisplay}</div>
                <div><strong>Location:</strong> ${locationDisplay}</div>
                ${formData.preferredDate ? `<div><strong>Preferred Date/Time:</strong> ${new Date(formData.preferredDate).toLocaleString()}</div>` : ''}
              </div>
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h2 style="color: #a16207; margin: 0 0 15px 0; font-size: 18px;">What Happens Next?</h2>
              <ul style="margin: 0; padding-left: 20px; color: #a16207;">
                <li style="margin-bottom: 8px;">We'll review your request and contact you within 2 hours during business hours (8 AM - 8 PM)</li>
                <li style="margin-bottom: 8px;">We'll discuss pricing, timeline, and any special requirements</li>
                <li style="margin-bottom: 8px;">Once confirmed, we'll schedule your service at your convenience</li>
              </ul>
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; text-align: center;">
              <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">Need Immediate Assistance?</h3>
              <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                <a href="tel:+14059988232" style="color: #2563eb; text-decoration: none; font-weight: bold;">📞 (405) 998-8232</a>
                <a href="mailto:traxispathfinder@gmail.com" style="color: #2563eb; text-decoration: none; font-weight: bold;">✉️ traxispathfinder@gmail.com</a>
              </div>
              <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
                Text us 24 hours a day for questions or quotes!
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                Local Errands Oklahoma - Serving Wynnewood, Davis, Pauls Valley, and Sulphur
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
                Professional, Reliable, Trusted
              </p>
            </div>
          </div>
        </div>
      `
    }

    // Send confirmation email to customer
    console.log('Sending confirmation email to customer...')
    const customerResponse = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(customerEmailData)
    })

    const customerResult = await customerResponse.json()
    console.log('Customer email response:', customerResult)

    if (!customerResponse.ok) {
      console.error('Failed to send customer email:', customerResult)
      // Don't throw error here as business notification was successful
      console.warn('Customer confirmation email failed, but business was notified')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notifications sent successfully',
        businessEmailSent: true,
        customerEmailSent: customerResponse.ok
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Email notification error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email notifications',
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})