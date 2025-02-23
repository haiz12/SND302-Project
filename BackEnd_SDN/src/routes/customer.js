import express from "express";
import { CustomerController } from "../controllers/index.js";

const customerRouter = express.Router();

customerRouter.get("/", CustomerController.getallCustomer);
customerRouter.get("/:id", CustomerController.getCustomerByName);
customerRouter.post("/", CustomerController.createCustomer);
customerRouter.put("/:id", CustomerController.editCustomer);
customerRouter.delete("/:id", CustomerController.deleteCustomer);
export default customerRouter;