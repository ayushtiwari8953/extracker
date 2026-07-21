import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

let transporter = null;
function getTransport() {
  if (transporter) return transporter;
  if (!config.email.user || !config.email.pass) return null;
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: { user: config.email.user, pass: config.email.pass },
  });
  return transporter;
}

export async function sendEmail(to, subject, html) {
  const t = getTransport();
  if (!t) {
    console.info(`[email] (SMTP not configured) → ${to}: ${subject}`);
    return null;
  }
  return t.sendMail({ from: config.email.from, to, subject, html });
}

export function sendResetEmail(to, resetUrl) {
  return sendEmail(
    to,
    'FinTrack — Password reset',
    `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to set a new password. This link expires in 30 minutes.</p><p>If you didn't request this, ignore this email.</p>`
  );
}
