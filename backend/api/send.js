import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'matt@whaleblue.me',

      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email again</strong>!</p>',
    });

    console.log('Result===>', result);

    response.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email===>", error);
    response.status(501).json({ success: false });
  }
}
