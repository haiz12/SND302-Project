import express from "express";
import { AccountController } from "../controllers/index.js";

const logoutRouter = express.Router();
logoutRouter.post('/logout', AccountController.logoutAccount);
export default logoutRouter;
