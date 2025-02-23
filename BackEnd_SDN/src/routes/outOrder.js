import express from 'express';
import { OutOrderController } from '../controllers/index.js';

const outOrderRouter = express.Router();


outOrderRouter.get("/template/download", OutOrderController.downloadTemplate);
outOrderRouter.post("/import", OutOrderController.upload.single('file'), OutOrderController.importOutOrders);
outOrderRouter.get('/', OutOrderController.getAll);

outOrderRouter.get('/:id', OutOrderController.getById);
outOrderRouter.post('/', OutOrderController.create);
//edit
outOrderRouter.put("/:id", OutOrderController.edit);

//delete
outOrderRouter.delete("/:id", OutOrderController.del);

//get
outOrderRouter.get('/product/:id', OutOrderController.getByProductId);
outOrderRouter.get("/customer/:id", OutOrderController.getByCustomer);
outOrderRouter.get('/outorder/:date', OutOrderController.getByDate);
outOrderRouter.get('/outorder/:year/:month', OutOrderController.getByMonth);
export default outOrderRouter;