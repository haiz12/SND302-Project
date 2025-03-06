import mongoose from "mongoose";

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: (value) => value.length >= 8,
        message: "Password must be at least 8 characters long",
      },
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    avatar: {
      type: String,
    },
    role_id: {
      type: String,
      required: [true, "Role ID is required"],
    },
    otp: { type: String },
    otpExpired: { type: String },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const User = mongoose.model("accounts", userSchema);

// Xuất model
export default User;
