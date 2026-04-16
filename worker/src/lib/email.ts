import type { Env } from '../types';

/**
 * Send a transactional email via SendGrid.
 * Used for email verification and password reset flows.
 */
export async function sendEmail(env: Env, opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const payload = {
    personalizations: [{ to: [{ email: opts.to }] }],
    from: { email: env.EMAIL_FROM, name: env.EMAIL_FROM_NAME || 'Service as a Software' },
    subject: opts.subject,
    content: [
      { type: 'text/plain', value: opts.text },
      { type: 'text/html', value: opts.html },
    ],
  };

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('SendGrid error:', res.status, body);
    throw new Error(`SendGrid failed: ${res.status}`);
  }
}

/**
 * Render a plain transactional email with consistent branding.
 */
export function renderEmail(opts: {
  preheader: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  footer?: string;
}): { html: string; text: string } {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${opts.heading}</title>
</head>
<body style="margin:0;padding:0;background:#0b1426;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e5e7eb;">
  <div style="display:none;max-height:0;overflow:hidden;">${opts.preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b1426;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;background:#111827;border-radius:12px;padding:40px;">
          <tr><td style="font-size:24px;font-weight:700;color:#ffffff;padding-bottom:8px;">Service as a Software</td></tr>
          <tr><td style="font-size:20px;font-weight:600;color:#ffffff;padding:16px 0 8px;">${opts.heading}</td></tr>
          <tr><td style="font-size:15px;line-height:1.6;color:#d1d5db;padding-bottom:24px;">${opts.body}</td></tr>
          <tr>
            <td style="padding:8px 0 24px;">
              <a href="${opts.ctaUrl}" style="display:inline-block;background:#3b82f6;color:#ffffff;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;">${opts.ctaLabel}</a>
            </td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#9ca3af;padding-top:24px;border-top:1px solid #1f2937;">
              If the button doesn't work, copy and paste this URL into your browser:<br>
              <span style="color:#6b7280;word-break:break-all;">${opts.ctaUrl}</span>
            </td>
          </tr>
          ${opts.footer ? `<tr><td style="font-size:12px;color:#6b7280;padding-top:16px;">${opts.footer}</td></tr>` : ''}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    opts.heading,
    '',
    opts.body.replace(/<[^>]+>/g, ''),
    '',
    `${opts.ctaLabel}: ${opts.ctaUrl}`,
    opts.footer ? `\n${opts.footer}` : '',
  ].join('\n');

  return { html, text };
}
