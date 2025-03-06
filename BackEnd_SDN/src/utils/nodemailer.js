import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mã OTP để thay đổi mật khẩu",
    text: `Mã OTP để đổi mật khẩu của bạn là: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP đã được gửi thành công");
  } catch (error) {
    console.error("Lỗi khi gửi mail:", error);
  }
};

export { sendOTP };
