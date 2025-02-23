import express from "express";
import { AccountController } from "../controllers/index.js";

const accountRouter = express.Router();

// GET: /accounts -> Get all accounts
accountRouter.get("/", AccountController.getAccount);

//GET: /accounts/:id -> Get a single account
accountRouter.get("/:id", AccountController.getAccountById);

// POST: /accounts -> Create a new account
accountRouter.post("/", AccountController.createAccount);

// accountRouter.post("/login", AccountController.loginAccount);

// PUT: /accounts/:id
accountRouter.put("/:id", AccountController.editAccount);

// DELETE: /accounts/:id
accountRouter.delete("/:id", AccountController.deleteAccount);

export default accountRouter;
