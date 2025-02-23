import { ProductRepo } from "../services/index.js";
import multer from "multer";

// Cấu hình multer
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // giới hạn file 5MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file Excel'), false);
    }
  }
});

// GET: /products
const getProducts = async (req, res) => {
  try {
    const current = parseInt(req.query.current, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    const result = await ProductRepo.list(current, pageSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng upload file Excel",
      });
    }

    // Kiểm tra định dạng file
    if (!req.file.mimetype.includes('spreadsheet')) {
      return res.status(400).json({
        success: false,
        message: 'Chỉ chấp nhận file Excel'
      });
    }

    const result = await ProductRepo.importExcel(req.file);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const downloadTemplate = async (req, res) => {
  try {
    const buffer = await ProductRepo.generateTemplate();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=template_san_pham.xlsx');
    
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET: /products/1
const getProductById = async (req, res) => {
  try {
    res.status(200).json(await ProductRepo.getById(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const getProductByCode = async (req, res) => {
  try {
    res.status(200).json(await ProductRepo.getByCode(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const getProductBySupplier = async (req, res) => {
  try {
    res.status(200).json(await ProductRepo.getBySupplier(req.params.supplier));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// POST: /products
const createProduct = async (req, res) => {
  try {
    const {
      code,
      name,
      images,
      supplier,
      description,
      quantity,
      size,
      material,
      in_price,
      out_price,
    } = req.body;
    const newUser = await ProductRepo.create({
      code,
      name,
      images,
      supplier,
      description,
      quantity,
      size,
      material,
      in_price,
      out_price,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /products/1
const editProduct = async (req, res) => {
  try {
    res.status(200).json(await ProductRepo.edit(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

// DELETE: /products/1
const deleteProduct = async (req, res) => {
  try {
    res.status(200).json(await ProductRepo.deleteProduct(req.params.id));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  editProduct,
  deleteProduct,
  getProductByCode,
  getProductBySupplier,
  importProducts,
  downloadTemplate,
  upload
};