import User from "../models/account.js";
import jwt from 'jsonwebtoken'; // Import JWT

// Create
const create = async ({
  username,
  email,
  password,
  dob,
  gender,
  phoneNumber,
  avatar,
  role_id,
}) => {
  try {
    // Create new account
    const newAccount = await User.create({
      username,
      email,
      password,
      dob,
      gender,
      phoneNumber,
      avatar,
      role_id,
    });
    // Return newAccount object
    return newAccount._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};
// Get all accounts
const list = async (current = 1, pageSize = 10) => {
  try {
    const skip = (current - 1) * pageSize; // Calculate the number of records to skip
    const total = await User.countDocuments(); // Total number of records
    const accounts = await User.find({})
      .skip(skip) // Skip previous records
      .limit(pageSize) // Limit the number of records returned
      .exec();

    return {
      accounts,
      total,
      totalPages: Math.ceil(total / pageSize), // Calculate total pages
      currentPage: current, // Current page
      pageSize, // Records per page
    };
  } catch (error) {
    throw new Error(`Error fetching suppliers: ${error.message}`);
  }
};

const getById = async (id) => {
  try {
    return await User.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const loginAccount = async (username) => {
  try {
    const user = await User.findOne({ username }).exec();
    return user;
  } catch (error) {
    throw new Error(error);
  }
};
const edit = async (
  id,
  { username, email, password, dob, gender, phoneNumber, avatar, role_id }
) => {
  try {
    const updatedAccount = await User.findByIdAndUpdate(
      { _id: id },
      { username, email, password, dob, gender, phoneNumber, avatar, role_id },
      { new: true }
    );

    if (!updatedAccount) {
      throw new Error("Account not found");
    }

    return updatedAccount;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteAccount = async (id) => {
  try {
    return await User.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};
const removeRefreshToken = async (userId) => {
  try {
    // Xóa refreshToken của người dùng trong database
    await User.updateOne({ _id: userId }, { $unset: { refreshToken: 1 } });
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getUserInfo = async (token) => {
  try {
    // Giải mã token để lấy thông tin userId
    const decoded = jwt.verify(token, 'your_secret_key'); // Thay 'your_secret_key' bằng khóa bí mật của bạn
   
    // Tìm thông tin người dùng dựa trên userId
    const user = await User.findOne({ _id: decoded.userId }).exec();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(error.toString());
  }
};


export default {
  create,
  list,
  getById,
  edit,
  deleteAccount,
  getById,
  loginAccount,
  removeRefreshToken,
  getUserInfo
};
