import { Resend } from 'resend';

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.RESEND_FROM || 'Kadim Gizem <noreply@kadimgizem.com>';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kadimgizem.com';

function baseEmail(title: string, inner: string): string {
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
  body { margin:0; padding:0; background:#0a0a0f; font-family: Georgia, 'Times New Roman', serif; color:#e8e6e3; }
  .wrap { max-width:600px; margin:0 auto; padding:40px 24px; }
  .card { background: linear-gradient(180deg, #12121a 0%, #0d0d14 100%); border:1px solid #2a2a38; border-radius: 12px; padding: 40px 32px; }
  .brand { text-align:center; font-family: 'Cinzel', Georgia, serif; font-size: 28px; letter-spacing: 6px; color:#d4af37; text-transform: uppercase; margin-bottom: 8px; }
  .tagline { text-align:center; color:#8a8a99; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 32px; }
  h1 { font-family: 'Cinzel', Georgia, serif; color:#d4af37; font-size: 24px; text-align:center; margin: 0 0 24px; letter-spacing: 2px; }
  p { color:#c8c6c2; font-size: 16px; line-height: 1.7; margin: 0 0 16px; }
  .btn { display:inline-block; background: linear-gradient(180deg, #d4af37 0%, #b8941f 100%); color:#0a0a0f !important; text-decoration:none; padding: 14px 32px; border-radius: 6px; font-weight:bold; letter-spacing: 1px; text-transform: uppercase; font-size: 13px; }
  .center { text-align:center; margin: 28px 0; }
  .divider { height:1px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 32px 0; }
  .footer { text-align:center; color:#6a6a78; font-size: 12px; margin-top: 24px; }
  .footer a { color:#8a8a99; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="brand">Kadim Gizem</div>
      <div class="tagline">Mitoloji | Tarih | Gerceki</div>
      <div class="divider"></div>
      ${inner}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Kadim Gizem &mdash; Tum haklari saklidir.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendNewsletterConfirmation(
  email: string,
  unsubscribeUrl: string
) {
  const resend = getResend();
  if (!resend) {
    console.warn('[resend] No API key — skipping confirmation email');
    return { skipped: true };
  }
  const inner = `
    <h1>Aramiza Hos Geldin</h1>
    <p>Kadim Gizem bultenine abone oldugun icin tesekkur ederiz. Artik mitolojinin derinliklerinden, tarihin golgelerinden ve bilimin sinirlarindan gelen en ozenli icerikleri dogrudan e-posta kutunda bulacaksin.</p>
    <p>Her hafta; unutulmus efsaneler, gizli kalmis tarihi gercekler ve sorgulanmasi gereken gizemleri seninle paylasacagiz.</p>
    <div class="center">
      <a class="btn" href="${SITE}">Siteyi Ziyaret Et</a>
    </div>
    <div class="divider"></div>
    <p style="font-size:13px; color:#8a8a99; text-align:center;">
      Bultenden ayrilmak istersen <a href="${unsubscribeUrl}" style="color:#d4af37;">buraya tiklayabilirsin</a>.
    </p>
  `;
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Kadim Gizem Bultenine Hos Geldin',
    html: baseEmail('Hos Geldin', inner),
  });
}

export async function sendCommentNotification(
  to: string,
  postTitle: string,
  postUrl: string,
  commentAuthor: string,
  commentBody: string
) {
  const resend = getResend();
  if (!resend) return { skipped: true };
  const inner = `
    <h1>Yeni Yorum</h1>
    <p><strong style="color:#d4af37;">${commentAuthor}</strong> "<em>${postTitle}</em>" yazina yorum yapti:</p>
    <p style="border-left:3px solid #d4af37; padding-left:16px; color:#b8b6b2;">${commentBody}</p>
    <div class="center">
      <a class="btn" href="${postUrl}">Yorumu Goruntule</a>
    </div>
  `;
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Yeni yorum: ${postTitle}`,
    html: baseEmail('Yeni Yorum', inner),
  });
}

export async function sendContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  const resend = getResend();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kadimgizem.com';
  if (!resend) return { skipped: true };
  const inner = `
    <h1>Yeni Iletisim Mesaji</h1>
    <p><strong style="color:#d4af37;">Gonderen:</strong> ${name} &lt;${email}&gt;</p>
    <p><strong style="color:#d4af37;">Konu:</strong> ${subject}</p>
    <div class="divider"></div>
    <p style="white-space: pre-wrap;">${message}</p>
  `;
  return resend.emails.send({
    from: FROM,
    to: adminEmail,
    replyTo: email,
    subject: `[Iletisim] ${subject}`,
    html: baseEmail('Iletisim', inner),
  });
}
