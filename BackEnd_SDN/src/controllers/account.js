import { AccountRepo } from "../services/index.js";
import jwt from 'jsonwebtoken';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../jwt_helper.js";
import createError from "http-errors";

// GET: /accounts
const getAccount = async (req, res) => {
  try {
    const current = parseInt(req.query.current, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    const result = await AccountRepo.list(current, pageSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAccountById = async (req, res) => {
  try {
    const account = await AccountRepo.getById(req.params.id);
    if (!account) {
      throw createError.NotFound("Account not found");
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// POST: /accounts
const createAccount = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      dob,
      gender,
      phoneNumber,
      avatar,
      role_id,
    } = req.body;

    const newUser = await AccountRepo.create({
      username,
      email,
      password,
      dob,
      gender,
      phoneNumber,
      avatar,
      role_id,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /accounts/:id
const editAccount = async (req, res) => {
  try {
    const updatedAccount = await AccountRepo.edit(req.params.id, req.body);
    if (!updatedAccount) {
      throw createError.NotFound("Account not found");
    }
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

const loginAccount = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw createError.BadRequest("Invalid Username/Password");
    }

    const existUser = await AccountRepo.loginAccount(username);
    if (!existUser) {
      throw createError.NotFound("User not registered");
    }

    if (password !== existUser.password) {
      throw createError.Unauthorized("Username/Password not valid");
    }

    const accessToken = await signAccessToken(existUser.id);
    const refreshToken = await signRefreshToken(existUser.id);
    res.status(200).json({ accessToken, refreshToken, existUser });
  } catch (error) {
    next(error);
  }
};

// DELETE: /accounts/:id
const deleteAccount = async (req, res) => {
  try {
    const deletedAccount = await AccountRepo.deleteAccount(req.params.id);
    if (!deletedAccount) {
      throw createError.NotFound("Account not found");
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const logoutAccount = async (req, res, next) => {
  try {
    // Lấy token từ tiêu đề Authorization
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw createError.Unauthorized("Token is required");
    }

    // Giải mã token để lấy userId
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Xóa refreshToken của người dùng trong cơ sở dữ liệu
    await AccountRepo.removeRefreshToken(decoded.userId);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error); // Sử dụng middleware next để xử lý lỗi
  }
};


const getUserInfo = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw createError.Unauthorized("Token is required");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await AccountRepo.getById(decoded.userId);
    if (!user) {
      throw createError.NotFound("User not found");
    }

    // Loại bỏ password trước khi trả về
    user.password = undefined; // Hoặc delete user.password;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};


export default {
  getAccount,
  getAccountById,
  createAccount,
  editAccount,
  deleteAccount,
  loginAccount,
  logoutAccount,
  getUserInfo,
};
