import express from 'express';
import { SupplierController } from '../controllers/index.js';

const supplierRouter = express.Router();
// Route cho import/export
supplierRouter.get("/template/download", SupplierController.downloadTemplate);
supplierRouter.post("/import", SupplierController.upload.single('file'), SupplierController.importSuppliers);
supplierRouter.get('/', SupplierController.getSupplier);

supplierRouter.get('/:id', SupplierController.getSupplierById);

supplierRouter.post('/', SupplierController.createSupplier);

supplierRouter.put("/:id", SupplierController.editSupplier);


supplierRouter.delete("/:id", SupplierController.deleteSupplier);

export default supplierRouter;