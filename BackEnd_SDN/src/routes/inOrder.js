import express from 'express';
import { InOrderController } from '../controllers/index.js';

const InOrderRouter = express.Router();

InOrderRouter.get("/template/download", InOrderController.downloadTemplate);
InOrderRouter.post("/import", InOrderController.upload.single('file'), InOrderController.importInOrders);

InOrderRouter.get('/', InOrderController.getAll);

InOrderRouter.get('/:id', InOrderController.getById);

InOrderRouter.post('/', InOrderController.create);
//edit
InOrderRouter.put("/:id", InOrderController.edit);

//delete
InOrderRouter.delete("/:id", InOrderController.del);

//get
InOrderRouter.get('/product/:id', InOrderController.getByProductId);
InOrderRouter.get("/supplier/:id", InOrderController.getBySupplier);
InOrderRouter.get('/inorder/:date', InOrderController.getByDate);
InOrderRouter.get('/inorder/:year/:month', InOrderController.getByMonth);
export default InOrderRouter;