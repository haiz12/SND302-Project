import express from "express";
import { AccountController } from "../controllers/index.js";

const loginRouter = express.Router();

loginRouter.post("/", AccountController.loginAccount);
loginRouter.get("/accounts", AccountController.getUserInfo);
export default loginRouter;
