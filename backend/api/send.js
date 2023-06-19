import { Resend } from 'resend';

const resend = new Resend('RESEND_API_KEY');

export default async function handler(request, response) {
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'matt@whaleblue.me',

      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email again</strong>!</p>',
    });

    console.log('result===>', result);

    response.status(200).json({ success: true });
  } catch (error) {
    response.status(501).json({ success: false });
  }
}
