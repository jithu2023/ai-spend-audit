import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, companyName, totalSavings, shareId, userName } = await request.json();
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ai-spend-audit-hazel-seven.vercel.app';
    
    const { data, error } = await resend.emails.send({
      from: 'AI Spend Audit <onboarding@resend.dev>',
      to: [email],
      subject: 'Your AI Spend Audit Report',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AI Spend Audit Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #3b82f6; }
            .header h1 { color: #1e3a8a; margin: 0; }
            .savings-box { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0; }
            .savings-amount { font-size: 48px; font-weight: bold; color: #16a34a; margin: 0; }
            .savings-label { font-size: 14px; color: #166534; margin-top: 8px; }
            .section { margin: 24px 0; }
            .section-title { font-size: 18px; font-weight: 600; color: #1f2937; border-left: 4px solid #3b82f6; padding-left: 12px; margin-bottom: 16px; }
            .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 8px 0; }
            .footer { text-align: center; padding-top: 24px; margin-top: 32px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            .note { background-color: #fef3c7; padding: 12px; border-radius: 8px; font-size: 12px; color: #92400e; margin: 16px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤖 AI Spend Audit</h1>
              <p style="color: #6b7280;">Your Personalized Savings Report</p>
            </div>
            
            <div class="savings-box">
              <div class="savings-amount">$${totalSavings}/month</div>
              <div class="savings-label">Potential Monthly Savings</div>
              <div style="font-size: 20px; font-weight: bold; color: #16a34a; margin-top: 8px;">$${totalSavings * 12}/year</div>
              <div class="savings-label">Potential Annual Savings</div>
            </div>
            
            <div class="section">
              <div class="section-title">📊 What We Found</div>
              <p>Based on your AI tool usage, we've identified opportunities to optimize your spending. Your personalized recommendations are available in the full report.</p>
            </div>
            
            <div class="section" style="text-align: center;">
              <a href="${appUrl}/share/${shareId}" class="button">📄 View Your Full Report</a>
              <p style="font-size: 12px; color: #6b7280; margin-top: 12px;">Share this link with your team to collaborate on savings</p>
            </div>
            
            <div class="section">
              <div class="section-title">🎯 Next Steps</div>
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin: 8px 0;">✅ Review detailed recommendations in your report</li>
                <li style="margin: 8px 0;">📤 Share results with your team using the shareable link</li>
                <li style="margin: 8px 0;">💬 Book a consultation with Credex for discounted AI credits</li>
              </ul>
            </div>
            
            <div class="note">
              💡 <strong>Pro Tip:</strong> Bookmark your report link to track savings as you implement recommendations!
            </div>
            
            <div class="footer">
              <p>Powered by <strong>Credex</strong> — Get discounted AI credits from companies that overforecast</p>
              <p style="margin-top: 8px;">
                <a href="${appUrl}" style="color: #3b82f6; text-decoration: none;">Run another audit</a> | 
                <a href="#" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
              </p>
              <p style="margin-top: 8px;">© ${new Date().getFullYear()} AI Spend Audit. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    if (error) {
      console.error('Resend error:', error);
      throw error;
    }
    
    console.log('✅ Email sent to:', email);
    return NextResponse.json({ success: true, messageId: data?.id });
    
  } catch (error) {
    console.error('Email send error:', error);
    // Return success anyway to not break user flow
    return NextResponse.json({ success: false, error: 'Email failed but lead saved' }, { status: 200 });
  }
}