import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { user_name, user_email, user_phone, tile_name, tile_series, tile_dimension, message } = await request.json();

    // Retrieve environment variables
    const apiKey = process.env.RESEND_API_KEY;
    const sender = process.env.NEXT_PUBLIC_NOTIFICATION_SENDER || "Sonata Tiles <onboarding@resend.dev>";
    const receiver = process.env.NEXT_PUBLIC_NOTIFICATION_RECEIVER || "modimeet05@gmail.com";

    // Validate Resend API Key is set
    if (!apiKey || apiKey === "re_your_api_key_here") {
      console.warn("Resend email dispatch skipped: RESEND_API_KEY is not configured in .env.local");
      return NextResponse.json(
        { error: "RESEND_API_KEY is not set. Email dispatch skipped." },
        { status: 400 }
      );
    }

    // Resolve absolute URL for the company logo based on request host
    const origin = new URL(request.url).origin;
    const logoUrl = `${origin}/SONATA%20LOGO.png`;

    // Detect if running on localhost. Email clients cannot fetch images from localhost, 
    // so we use a beautiful styled typographic header fallback to prevent broken images during testing.
    const isLocalhost = origin.includes("localhost") || origin.includes("127.0.0.1");
    const logoHtml = isLocalhost 
      ? `
      <div style="display: inline-block; vertical-align: middle;">
        <span style="font-family: Georgia, 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #FFFFFF; letter-spacing: 4px; text-transform: uppercase; vertical-align: middle;">SONATA</span>
        <span style="font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 800; color: #E31E24; letter-spacing: 2px; text-transform: uppercase; margin-left: 6px; padding: 4px 8px; border: 1.5px solid #E31E24; border-radius: 4px; vertical-align: middle;">TILES</span>
      </div>
      `
      : `<img src="${logoUrl}" alt="Sonata Tiles" style="max-width: 180px; width: 100%; height: auto; display: inline-block;" />`;

    // Build the premium HTML email body matching Sonata brand style
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Client Inquiry</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 40px 16px; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0;">
    
    <!-- Top Decorative Brand Line -->
    <div style="height: 6px; background: linear-gradient(90deg, #1D2A54 0%, #E31E24 50%, #1D2A54 100%);"></div>
    
    <!-- Header with Official Company Logo -->
    <div style="background-color: #111B3A; padding: 36px 32px; text-align: center;">
      ${logoHtml}
      <div style="color: rgba(255, 255, 255, 0.5); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 2.5px; margin-top: 12px;">Showroom Inquiry Notification</div>
    </div>
    
    <!-- Main Content Container -->
    <div style="padding: 40px 32px;">
      <h2 style="color: #111B3A; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.01em; font-family: Georgia, serif;">
        New Portal Inquiry
      </h2>
      <p style="color: #64748B; font-size: 14px; line-height: 1.6; margin-top: 0; margin-bottom: 32px;">
        A customer has submitted a new inquiry. The registration and material details are provided below:
      </p>
      
      <!-- Customer Information Card -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
        <h3 style="color: #1D2A54; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">
          Contact Profile
        </h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748B; width: 35%;">Client Name</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #1E293B;">${user_name || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748B;">Email Address</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 600;"><a href="mailto:${user_email}" style="color: #E31E24; text-decoration: none; font-weight: 700;">${user_email || "N/A"}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748B;">Phone Contact</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 600;"><a href="tel:${user_phone}" style="color: #1D2A54; text-decoration: none; font-weight: 700;">${user_phone || "N/A"}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748B;">Subject / Material</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #1D2A54;">${tile_name || "General Showroom Inquiry"}</td>
          </tr>
          ${tile_series ? `
          <tr>
            <td style="padding: 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748B;">Slab Series</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #1D2A54;">${tile_series}</td>
          </tr>
          ` : ""}
          ${tile_dimension ? `
          <tr>
            <td style="padding: 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748B;">Slab Dimension</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #1D2A54;">${tile_dimension.toUpperCase()} MM</td>
          </tr>
          ` : ""}
        </table>
      </div>
      
      <!-- Message Card -->
      <div style="border-left: 4px solid #E31E24; background-color: #FFF8F8; padding: 24px; border-radius: 0 12px 12px 0;">
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #C4181E; display: block; margin-bottom: 8px;">Inquiry Details</span>
        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message || "No message supplied."}</p>
      </div>
      
    </div>
    
    <!-- Footer Section -->
    <div style="background-color: #F1F5F9; padding: 28px 32px; text-align: center; border-top: 1px solid #E2E8F0;">
      <p style="color: #64748B; font-size: 12px; margin: 0 0 4px 0;">This notification is auto-generated by the Sonata Tiles Showroom System.</p>
      <p style="color: #94A3B8; font-size: 10px; margin: 0;">&copy; ${new Date().getFullYear()} Sonata Tiles. All rights reserved.</p>
    </div>
    
  </div>
</body>
</html>
    `;

    // Make secure server-side POST request to Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: sender,
        to: [receiver],
        reply_to: user_email || undefined,
        subject: `New Sonata Tiles Inquiry: ${user_name || "Client"}`,
        html: htmlBody
      })
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API transmission error:", resendResult);
      return NextResponse.json(
        { error: "Resend failed to send email", details: resendResult },
        { status: resendResponse.status }
      );
    }

    console.log("Resend email transmitted successfully:", resendResult);
    return NextResponse.json({ success: true, emailId: resendResult.id });
  } catch (error) {
    console.error("Critical server-side email handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
