import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true, sparse: true },
    provider: { type: String, default: "local" },
    fullName: { type: String, default: "" },
    gender: { type: String, default: "other" },
    birthday: {
      day: { type: String, default: "" },
      month: { type: String, default: "" },
      year: { type: String, default: "" },
    },
    address: {
      city: { type: String, default: "" },
      district: { type: String, default: "" },
      ward: { type: String, default: "" },
      street: { type: String, default: "" },
    },
    role: { type: String, default: "user" },
    avatar: { type: String, default: "" },

    // Thêm trường OTP và xác thực OTP
    otp: { type: String },
    otpExpires: { type: Date },
    isOtpVerified: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
