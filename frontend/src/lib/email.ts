import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT ?? "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.EMAIL_FROM ?? "HandyUndPCService <noreply@handyundpcservice.de>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Template helper ──────────────────────────────────────────────────────────

function baseTemplate(content: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background:#0f172a; color:#e2e8f0; }
    .container { max-width:600px; margin:0 auto; padding:40px 20px; }
    .card { background:#1e293b; border-radius:16px; padding:40px; border:1px solid #334155; }
    .logo { font-size:24px; font-weight:800; color:#3b82f6; margin-bottom:32px; }
    .logo span { color:#f97316; }
    h1 { font-size:22px; color:#f1f5f9; margin:0 0 16px; }
    p { font-size:15px; color:#94a3b8; line-height:1.6; margin:0 0 16px; }
    .btn { display:inline-block; padding:14px 28px; background:#3b82f6; color:#fff !important; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px; }
    .divider { border:none; border-top:1px solid #334155; margin:24px 0; }
    .small { font-size:12px; color:#64748b; }
    .footer { margin-top:32px; text-align:center; font-size:12px; color:#475569; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">Handy<span>&</span>PC Service</div>
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} HandyUndPCService. Alle Rechte vorbehalten.</p>
      <p><a href="${APP_URL}/impressum" style="color:#3b82f6">Impressum</a> · <a href="${APP_URL}/datenschutz" style="color:#3b82f6">Datenschutz</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Email senders ────────────────────────────────────────────────────────────

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${APP_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "E-Mail-Adresse bestätigen – HandyUndPCService",
    html: baseTemplate(
      `<h1>Willkommen, ${name}!</h1>
      <p>Bitte bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.</p>
      <p><a class="btn" href="${url}">E-Mail bestätigen</a></p>
      <hr class="divider" />
      <p class="small">Dieser Link ist 24 Stunden gültig. Falls du dich nicht registriert hast, ignoriere diese E-Mail.</p>`,
      "E-Mail bestätigen"
    ),
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const url = `${APP_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Passwort zurücksetzen – HandyUndPCService",
    html: baseTemplate(
      `<h1>Passwort zurücksetzen</h1>
      <p>Hallo ${name}, du hast ein Zurücksetzen deines Passworts angefordert.</p>
      <p><a class="btn" href="${url}">Neues Passwort festlegen</a></p>
      <hr class="divider" />
      <p class="small">Dieser Link ist 1 Stunde gültig. Falls du dies nicht angefordert hast, kannst du diese E-Mail ignorieren.</p>`,
      "Passwort zurücksetzen"
    ),
  });
}

export async function sendRepairStatusEmail(
  email: string,
  name: string,
  repairId: string,
  status: string,
  notes?: string
) {
  const statusMap: Record<string, string> = {
    RECEIVED:      "Gerät eingegangen",
    IN_PROGRESS:   "Reparatur läuft",
    WAITING_PARTS: "Warte auf Ersatzteile",
    DONE:          "Reparatur abgeschlossen",
    CANCELLED:     "Auftrag storniert",
  };

  const label = statusMap[status] ?? status;
  const url = `${APP_URL}/dashboard/repairs`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Reparatur-Status: ${label} – HandyUndPCService`,
    html: baseTemplate(
      `<h1>Statusupdate zu deiner Reparatur</h1>
      <p>Hallo ${name}, dein Reparaturauftrag wurde aktualisiert:</p>
      <p><strong>Neuer Status:</strong> ${label}</p>
      ${notes ? `<p><strong>Notiz des Technikers:</strong> ${notes}</p>` : ""}
      <p><a class="btn" href="${url}">Auftrag ansehen</a></p>`,
      "Reparatur-Status"
    ),
  });
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderId: string,
  total: number
) {
  const url = `${APP_URL}/dashboard/orders/${orderId}`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Bestellung bestätigt – HandyUndPCService",
    html: baseTemplate(
      `<h1>Danke für deine Bestellung!</h1>
      <p>Hallo ${name}, wir haben deine Bestellung erhalten.</p>
      <p><strong>Gesamtbetrag:</strong> ${total.toFixed(2)} €</p>
      <p><a class="btn" href="${url}">Bestellung ansehen</a></p>`,
      "Bestellung bestätigt"
    ),
  });
}

export async function sendBuybackUpdateEmail(
  email: string,
  name: string,
  status: string,
  finalPrice?: number
) {
  const statusMap: Record<string, string> = {
    ACCEPTED:  "Ankauf akzeptiert",
    REJECTED:  "Ankauf abgelehnt",
    COMPLETED: "Ankauf abgeschlossen",
  };

  const label = statusMap[status] ?? status;
  const url = `${APP_URL}/dashboard/buybacks`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Ankauf-Status: ${label} – HandyUndPCService`,
    html: baseTemplate(
      `<h1>Update zu deinem Ankaufantrag</h1>
      <p>Hallo ${name}, dein Ankaufantrag wurde aktualisiert:</p>
      <p><strong>Status:</strong> ${label}</p>
      ${finalPrice ? `<p><strong>Angebotener Preis:</strong> ${finalPrice.toFixed(2)} €</p>` : ""}
      <p><a class="btn" href="${url}">Antrag ansehen</a></p>`,
      "Ankauf-Status"
    ),
  });
}
