import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Chuyển đổi đường dẫn của file hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hàm đọc template email
const readTemplate = (filename) => {
  try {
    // Tạo đường dẫn chính xác đến thư mục templates
    const filePath = path.resolve(__dirname, "../templates", filename);
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error("Lỗi đọc file template:", error);
    throw new Error("Không thể đọc template email.");
  }
};

const sendOtpEmail = async (email, name, otp, isPasswordReset = true) => {
    try {
      // Đọc template và biên dịch với dữ liệu động
      const emailTemplate = readTemplate("otp_email.hbs");
      const compiledTemplate = handlebars.compile(emailTemplate);
      const htmlContent = compiledTemplate({ name, otp, isPasswordReset });
  
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
  
      const subject = isPasswordReset 
        ? "Mã OTP xác nhận từ HDND Store" 
        : "Xác nhận đăng ký tài khoản HDND Store";
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: htmlContent, 
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email ${isPasswordReset ? 'OTP' : 'Xác thực'} đã gửi thành công!`);
    } catch (error) {
      console.error("❌ Lỗi gửi email:", error);
      throw new Error("Không thể gửi email.");
    }
  };
  
export default sendOtpEmail;
