import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SHOOTER_EMAIL,
    pass: process.env.SHOOTER_PASS, // App password
  },
  connectionTimeout: 15000, // 15 seconds (increased)
  socketTimeout: 15000, // 15 seconds (increased)
});

// Promise with timeout wrapper
const sendEmailWithTimeout = (promise, timeoutMs = 20000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timeout")), timeoutMs),
    ),
  ]);
};

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"Portfolio App" <${process.env.SHOOTER_EMAIL}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await sendEmailWithTimeout(
      transporter.sendMail(mailOptions),
      20000, // 20 second timeout
    );
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    // Don't throw - let request complete even if email fails
  }
};

export { sendEmail };
