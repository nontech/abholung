import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/app/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  
  const body = await req.json();
  const { emails } = body;

  if (!process.env.EMAIL_FROM) {
    return NextResponse.json({ error: 'EMAIL_FROM environment variable is not set' }, { status: 500 })
  }

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: 'Missing required field: emails' }, { status: 400 })
  }

  try {
    for (const email of emails) {
      const { to, subject, type, orderData } = email;
      if (!to || !subject || !type || !orderData) {
        return NextResponse.json({ error: 'Missing required fields in one of the emails: to, subject, type, orderData' }, { status: 400 })
      }

      // Send email
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        react: EmailTemplate({ type, orderData }),
      });
    }
    return NextResponse.json({ message: 'Emails sent successfully'}, { status: 200 })
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send emails 4' }, { status: 500 })
  }
}
