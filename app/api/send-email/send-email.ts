import type { NextApiRequest, NextApiResponse } from 'next';
import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { to, subject, text } = req.body;

    if (!process.env.EMAIL_FROM) {
        return res.status(500).json({ error: 'EMAIL_FROM environment variable is not set' });
    }
  
    if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, text' });
    }

    try {
      // Send email
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
      });
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}