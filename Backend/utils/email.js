const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const getSender = () => ({
  name: process.env.EMAIL_FROM_NAME || "Eventify",
  email:
    process.env.EMAIL_FROM ||
    process.env.BREVO_SENDER_EMAIL ||
    process.env.SMTP_FROM,
});

const createSmtpTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT || 2525),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
  });

const sendViaBrevoApi = async ({ to, subject, html }) => {
  const sender = getSender();

  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  if (!sender.email) {
    throw new Error(
      "EMAIL_FROM, BREVO_SENDER_EMAIL, or SMTP_FROM is not configured",
    );
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender,
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Brevo API email failed (${response.status}): ${body}`);
  }

  console.log(`Brevo API accepted email to ${to}: ${body}`);
};

const sendViaSmtp = async ({ to, subject, html }) => {
  const sender = getSender();

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER or SMTP_PASS is not configured");
  }

  if (!sender.email) {
    throw new Error("EMAIL_FROM, BREVO_SENDER_EMAIL, or SMTP_FROM is not configured");
  }

  const info = await createSmtpTransporter().sendMail({
    from: `"${sender.name}" <${sender.email}>`,
    to,
    subject,
    html,
  });

  if (!info.accepted?.length) {
    throw new Error(`SMTP email was not accepted. Rejected: ${info.rejected}`);
  }

  console.log(
    `SMTP accepted email to ${to}. Message ID: ${info.messageId || "unknown"}`,
  );
};

const sendEmail = async (mail) => {
  if (process.env.BREVO_API_KEY) {
    return sendViaBrevoApi(mail);
  }

  return sendViaSmtp(mail);
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    await sendEmail({
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventify.</p>
      `,
    });
    console.log("Email sent successfully to", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendOTPEmail = async (userEmail, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "Verify your Eventify Account"
        : "Eventify Booking Verification";
    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventify account."
        : "Please use the following OTP to verify and confirm your event booking.";

    await sendEmail({
      to: userEmail,
      subject: title,
      html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `,
    });
    console.log(`OTP sent to ${userEmail} for ${type}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

module.exports = { sendBookingEmail, sendOTPEmail };
