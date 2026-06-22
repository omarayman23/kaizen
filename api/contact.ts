/**
 * Vercel Serverless Function — Contact form handler.
 *
 * Runs server-side (the RESEND_API_KEY never reaches the browser). On a valid
 * POST it sends two emails through the Resend REST batch endpoint:
 *   1. A notification to the business inbox with the submission details.
 *   2. A themed auto-reply to the visitor confirming we received their message.
 *
 * Configure via Vercel environment variables (all optional except the key):
 *   RESEND_API_KEY  — required. From https://resend.com/api-keys
 *   OWNER_EMAIL     — where submissions are delivered (default contract@…)
 *   FROM_EMAIL      — verified sender (default "Kaizen … <contract@…>")
 */

const RESEND_BATCH_ENDPOINT = "https://api.resend.com/emails/batch";

const OWNER_EMAIL = process.env.OWNER_EMAIL || "contract@kaizenpmconsulting.com";
const FROM_EMAIL =
  process.env.FROM_EMAIL ||
  "Kaizen Project Management <contract@kaizenpmconsulting.com>";

const SITE_URL = "https://www.kaizenpmconsulting.com";
const LOGO_URL = `${SITE_URL}/kaizen-logo.png`;

// Theme palette (mirrors src/styles/theme.css)
const NAVY = "#1b2a4a";
const SAND = "#e2caa4";
const CREAM = "#faf7f1";
const CREAM2 = "#f2ede2";
const LINE = "#e6e2da";
const MUTED = "#718096";
const RED = "#c8102e";

const FONT_STACK =
  "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

type Submission = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
};

const escapeHtml = (value: string): string =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Shared responsive email shell — table-based + inline styles for email clients. */
function shell(preheader: string, inner: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Kaizen Project Management & Consulting</title>
</head>
<body style="margin:0;padding:0;background:${CREAM2};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(
    preheader
  )}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM2};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${LINE};">
          <!-- Brand header -->
          <tr>
            <td align="center" style="padding:28px 32px 22px;background:#ffffff;border-bottom:1px solid ${LINE};">
              <img src="${LOGO_URL}" width="52" height="52" alt="Kaizen Project Management and Consulting" style="display:block;border:0;outline:none;text-decoration:none;height:52px;width:auto;margin:0 auto 12px;" />
              <div style="font-family:${FONT_STACK};font-size:13px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${NAVY};">
                Kaizen Project Management &amp; Consulting
              </div>
            </td>
          </tr>
          <!-- Accent rule -->
          <tr><td style="height:3px;line-height:3px;font-size:0;background:${NAVY};">&nbsp;</td></tr>
          <tr><td style="height:3px;line-height:3px;font-size:0;background:${SAND};">&nbsp;</td></tr>
          <!-- Body -->
          <tr>
            <td style="padding:34px 36px 30px;font-family:${FONT_STACK};">
              ${inner}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:22px 36px 26px;background:${CREAM};border-top:1px solid ${LINE};font-family:${FONT_STACK};">
              <p style="margin:0 0 4px;font-size:12px;line-height:1.6;color:${MUTED};">
                Kaizen Project Management and Consulting, LLC &middot; Virginia, United States
              </p>
              <p style="margin:0;font-size:12px;line-height:1.6;color:${MUTED};">
                <a href="${SITE_URL}" style="color:${NAVY};text-decoration:none;">kaizenpmconsulting.com</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:${OWNER_EMAIL}" style="color:${NAVY};text-decoration:none;">${OWNER_EMAIL}</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="max-width:560px;margin:16px auto 0;font-family:${FONT_STACK};font-size:11px;line-height:1.5;color:${MUTED};text-align:center;">
          You're receiving this because a message was submitted at kaizenpmconsulting.com.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const heading = (text: string): string =>
  `<h1 style="margin:0 0 18px;font-family:${FONT_STACK};font-size:22px;line-height:1.25;font-weight:600;letter-spacing:-0.02em;color:${NAVY};">${text}</h1>`;

const paragraph = (text: string): string =>
  `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#3a4661;">${text}</p>`;

/** A label/value detail row used inside the recap cards. */
function detailRow(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-family:${FONT_STACK};vertical-align:top;width:38%;">
      <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">${label}</span>
    </td>
    <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-family:${FONT_STACK};vertical-align:top;font-size:14px;line-height:1.55;color:${NAVY};">
      ${valueHtml}
    </td>
  </tr>`;
}

/** Auto-reply sent to the visitor. */
function confirmationEmail(s: Submission): { subject: string; html: string } {
  const firstName = escapeHtml(s.name.trim().split(/\s+/)[0] || "there");
  const recap = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;background:${CREAM};border:1px solid ${LINE};">
      <tr><td style="padding:18px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${detailRow("Project type", escapeHtml(s.projectType || "—"))}
          <tr>
            <td colspan="2" style="padding:12px 0 2px;font-family:${FONT_STACK};">
              <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">Your message</span>
              <p style="margin:8px 0 0;font-size:14px;line-height:1.65;color:#3a4661;white-space:pre-wrap;">${escapeHtml(
                s.message
              )}</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>`;

  const inner = `
    ${heading(`Thank you, ${firstName} — your note reached us.`)}
    ${paragraph(
      "We've received your message and a member of our team will personally reply, usually within two working days."
    )}
    ${paragraph("Here's a copy of what you sent us for your records:")}
    ${recap}
    ${paragraph(
      `If anything's urgent in the meantime, simply reply to this email or reach us at <a href="mailto:${OWNER_EMAIL}" style="color:${RED};text-decoration:none;">${OWNER_EMAIL}</a>.`
    )}
    <p style="margin:24px 0 0;font-size:15px;line-height:1.65;color:#3a4661;">
      Warm regards,<br />
      <strong style="color:${NAVY};">The Kaizen Team</strong>
    </p>`;

  return {
    subject: "We received your message — Kaizen Project Management & Consulting",
    html: shell(
      `Thanks ${firstName}, we received your message and will reply within two working days.`,
      inner
    ),
  };
}

/** Internal notification sent to the business inbox. */
function notificationEmail(s: Submission): { subject: string; html: string } {
  const inner = `
    ${heading("New enquiry from the website")}
    ${paragraph("A visitor just submitted the contact form. Details below — hit reply to respond directly to them.")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 8px;">
      ${detailRow("Name", escapeHtml(s.name))}
      ${detailRow(
        "Email",
        `<a href="mailto:${escapeHtml(s.email)}" style="color:${NAVY};text-decoration:underline;">${escapeHtml(
          s.email
        )}</a>`
      )}
      ${detailRow("Company / Agency", escapeHtml(s.company || "—"))}
      ${detailRow("Project type", escapeHtml(s.projectType || "—"))}
      <tr>
        <td colspan="2" style="padding:14px 0 2px;font-family:${FONT_STACK};">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">Message</span>
          <p style="margin:8px 0 0;font-size:14px;line-height:1.65;color:#3a4661;white-space:pre-wrap;">${escapeHtml(
            s.message
          )}</p>
        </td>
      </tr>
    </table>`;

  const who = s.company ? `${s.name} · ${s.company}` : s.name;
  return {
    subject: `New website enquiry — ${who}`,
    html: shell(`New contact form submission from ${s.name}.`, inner),
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  // Body is auto-parsed for application/json; guard for string bodies too.
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  // Honeypot: real users never fill this hidden field. Pretend success for bots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const company = String(body.company || "").trim();
  const message = String(body.message || "").trim();
  const projectType = String(
    body.projectType ||
      (Array.isArray(body.projectTypes) ? body.projectTypes.join(", ") : "")
  ).trim();

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Please add your name, email, and a short message." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "That email address looks off — mind checking it?" });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: "That message is a little long — please trim it under 5000 characters." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return res
      .status(500)
      .json({ error: "The mail service isn't configured yet. Please email us directly for now." });
  }

  const submission: Submission = { name, email, company, projectType, message };
  const notification = notificationEmail(submission);
  const confirmation = confirmationEmail(submission);

  try {
    const resp = await fetch(RESEND_BATCH_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          from: FROM_EMAIL,
          to: [OWNER_EMAIL],
          reply_to: email, // owner can reply straight to the visitor
          subject: notification.subject,
          html: notification.html,
        },
        {
          from: FROM_EMAIL,
          to: [email],
          reply_to: OWNER_EMAIL,
          subject: confirmation.subject,
          html: confirmation.html,
        },
      ]),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error(`[contact] Resend error ${resp.status}: ${detail}`);
      return res
        .status(502)
        .json({ error: "We couldn't send your message right now. Please try again shortly." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return res
      .status(500)
      .json({ error: "Something went wrong on our end. Please try again shortly." });
  }
}
