const nodemailer = require("nodemailer");
const { user, password } = require("../config/keys");

/**
 * Sends an email using Gmail SMTP.
 * @param {string} emailTo - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} code - Verification or action code.
 * @param {string} content - Description of what the code is for.
 */
const sendEmail = async (emailTo, subject, code, content) => {
  try {
    // Transporter configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: password,
      },
    });

    const message = {
      from: `"Moiz" <${user}>`,
      to: emailTo,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333;">Verification Code</h2>
          <p style="font-size: 15px; color: #555;">
            Use the code below to <strong>${content}</strong>.
          </p>
          <div style="margin: 20px 0; padding: 12px 20px; background: #007bff; color: #fff; display: inline-block; border-radius: 6px; font-size: 18px;">
            ${code}
          </div>
          <p style="font-size: 13px; color: #888;">If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.verify();

    await transporter.sendMail(message);
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
