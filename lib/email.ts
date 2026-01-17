import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export async function sendWelcomeEmail(to: string, name?: string) {
    if (!resend) {
        console.log('Resend API key not configured, skipping email');
        return;
    }

    try {
        await resend!.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject: 'Welcome to the Cryptography Reading Group!',
            html: `
        <h1>Welcome${name ? ` ${name}` : ''}!</h1>
        <p>Thank you for subscribing to the Cryptography Reading Group mailing list.</p>
        <p>You'll receive updates about upcoming talks, new papers, and group activities.</p>
        <p>Best regards,<br/>The Crypto Reading Group Team</p>
      `,
        });
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
}

export async function sendTalkNotification(
    subscribers: string[],
    talk: {
        title: string;
        speaker: string;
        date: string;
        time: string;
        location: string;
        zoomLink?: string;
    }
) {
    if (!resend) {
        console.log('Resend API key not configured, skipping email');
        return;
    }

    try {
        await resend!.emails.send({
            from: 'onboarding@resend.dev',
            to: subscribers,
            subject: `Upcoming Talk: ${talk.title}`,
            html: `
        <h1>Upcoming Talk</h1>
        <h2>${talk.title}</h2>
        <p><strong>Speaker:</strong> ${talk.speaker}</p>
        <p><strong>Date:</strong> ${talk.date}</p>
        <p><strong>Time:</strong> ${talk.time}</p>
        <p><strong>Location:</strong> ${talk.location}</p>
        ${talk.zoomLink ? `<p><strong>Zoom Link:</strong> <a href="${talk.zoomLink}">${talk.zoomLink}</a></p>` : ''}
        <p>We look forward to seeing you there!</p>
        <p>Best regards,<br/>The Crypto Reading Group Team</p>
      `,
        });
    } catch (error) {
        console.error('Failed to send talk notification:', error);
    }
}
