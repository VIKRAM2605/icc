import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM || smtpUser;

let transporter = null;

const isMailConfigured = Boolean(smtpHost && smtpPort && smtpUser && smtpPass && mailFrom);

if (isMailConfigured) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function sendEmail({ to, subject, text }) {
  if (!transporter) {
    return false;
  }

  await transporter.sendMail({
    from: mailFrom,
    to,
    subject,
    text,
  });

  return true;
}

export function canSendEmail() {
  return Boolean(transporter);
}
