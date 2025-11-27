import nodemailer from "nodemailer";

export function generateNumericOtp(length = 6) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++)
    otp += digits[Math.floor(Math.random() * 10)];
  return otp;
}

export async function sendOtpEmail(to, otp, options = {}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = options.subject || "Your verification code";
  const text =
    options.text ||
    `Your verification code is: ${otp}. It expires in ${
      options.ttlSeconds || 300
    } seconds.`;

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      `no-reply@${process.env.APP_DOMAIN || "example.com"}`,
    to,
    subject,
    text,
  });
}
