import jwt from "jsonwebtoken";
import createError from "http-errors";
import dotenv from "dotenv";
dotenv.config();

function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = { userId }; // Thêm userId vào payload
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "3h",
      issuer: "localhost:9999",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

function signRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = { userId }; // Thêm userId vào payload
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
      issuer: "localhost:9999",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

function verifyAccessToken(req, res, next) {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload; // payload bây giờ chứa userId
    next();
  });
}

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      const userId = payload.userId; 
      resolve(userId);
    });
  });
};


export {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
