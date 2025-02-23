import express from "express";
import { ProductController } from "../controllers/index.js";

const productRouter = express.Router();

// Route cho import/export
productRouter.get("/template/download", ProductController.downloadTemplate);
productRouter.post("/import", ProductController.upload.single('file'), ProductController.importProducts);

// GET: /products -> Get all products
productRouter.get("/", ProductController.getProducts);

// GET: /products/code/:id -> Get a product by code
productRouter.get("/code/:id", ProductController.getProductByCode);

// GET: /products/supplier/:id -> Get products by suppliers
productRouter.get("/supplier/:id", ProductController.getProductBySupplier);

// GET: /products/:id -> Get a product by Id
productRouter.get("/:id", ProductController.getProductById);

// POST: /products -> Create a new product
productRouter.post("/", ProductController.createProduct);

// PUT: /products/:id
productRouter.put("/:id", ProductController.editProduct);

// DELETE: /products/:id
productRouter.delete("/:id", ProductController.deleteProduct);

export default productRouter;