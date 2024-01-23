const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const generatetOtp = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    specialChars: true,
  });

  return otp;
};

const sendOtp = async (to, otp) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER_EMAIL,
      pass: process.env.GMAIL_USER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER_EMAIL,
    to: to,
    subject: "Hello User",
    html: `
        <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
        >
            <h2>Welcome to the Anonymous Discussion Forum.</h2>
            <h4>You are officially In ✔</h4>
            <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
        </div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully.");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Error sending OTP email");
  }
};

const sendNotifications = async (to, subject, html) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER_EMAIL,
      pass: process.env.GMAIL_USER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER_EMAIL,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

module.exports = {
  generatetOtp,
  sendOtp,
  sendNotifications
};
