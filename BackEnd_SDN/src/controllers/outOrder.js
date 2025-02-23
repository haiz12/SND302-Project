import { OutOrderRepo } from "../services/index.js";
import multer from 'multer';
const getAll = async (req, res) => {
  try {
    const current = parseInt(req.query.current, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    const result = await OutOrderRepo.list(current, pageSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// GET: /products/1
const getById = async (req, res) => {
  try {
    res.status(200).json(await OutOrderRepo.getById(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const getByProductId = async (req, res) => {
  try {
    res.status(200).json(await OutOrderRepo.getByCode(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const getByCustomer = async (req, res) => {
  try {
    res.status(200).json(await OutOrderRepo.getByCustomer(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// POST: /products
const create = async (req, res) => {
  try {
    // Get object from request body

    const {
      product,
      customer,
      out_price,
      quantity_real,
      quantity_doc,
      staff,
      receiver,
      invoice,
    } = req.body;
    const newUser = await OutOrderRepo.create({
      product,
      customer,
      out_price,
      quantity_real,
      quantity_doc,
      staff,
      receiver,
      invoice,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /products/1
const edit = async (req, res) => {
  try {
    res.status(200).json(await OutOrderRepo.edit(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

// DELETE: /products/1
const del = async (req, res) => {
  try {
    const result = await OutOrderRepo.deleteoutOrder(req.params.id); // Đảm bảo gọi đúng phương thức
    if (!result) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};
const getByDate = async (req, res) => {
  try {
    const orders = await OutOrderRepo.getByDate(req.params.date);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

const getByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const orders = await OutOrderRepo.getByMonth(year, month);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const importOutOrders = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng upload file Excel",
      });
    }

    const result = await OutOrderRepo.importExcel(req.file);
    res.status(200).json({
      success: true,
      message: "Import đơn nhập thành công",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi import đơn nhập",
      error: error.message,
    });
  }
};

// Cấu hình upload
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // giới hạn file 5MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file Excel"), false);
    }
  },
});

const downloadTemplate = async (req, res) => {
  try {
    const buffer = await OutOrderRepo.generateTemplate();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=out_orders_template.xlsx"
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo file template",
      error: error.message,
    });
  }
};

export default {
  getAll,
  getById,
  getByProductId,
  getByCustomer,
  create,
  edit,
  del,
  getByDate,
  getByMonth,
  importOutOrders, 
  upload,
  downloadTemplate
};
