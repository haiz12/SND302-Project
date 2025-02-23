import { SupplierRepo } from "../services/index.js";
import multer from 'multer';
const getSupplier = async (req, res) => {
  try {
    const current = parseInt(req.query.current, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    const result = await SupplierRepo.list(current, pageSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getSupplierById = async (req, res) => {
  try {
    res.status(200).json(await SupplierRepo.getById(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};


const createSupplier = async (req, res) => {
  try {


    const { code,name,logo, description,phone ,address,email,website, } = req.body;
    const newUser = await SupplierRepo.create({
        code,
        name,
        logo,
        description,
        phone ,
        address,
        email,
        website,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};


const editSupplier = async (req, res) => {
  try {
    res.status(200).json(await SupplierRepo.edit(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};


const deleteSupplier = async (req, res) => {
  try {
    res.status(200).json(await SupplierRepo.deleteProduct(req.params.id));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};
const importSuppliers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng upload file Excel"
      });
    }

    const result = await SupplierRepo.importExcel(req.file);
    res.status(200).json({
      success: true,
      message: "Import nhà cung cấp thành công",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi khi import nhà cung cấp",
      error: error.message
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
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file Excel'), false);
    }
  }
});

const downloadTemplate = async (req, res) => {
  try {
    const buffer = await SupplierRepo.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=supplier_template.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo file template",
      error: error.message
    });
  }
};
export default {
  getSupplier,
  getSupplierById,
  createSupplier,
  editSupplier,
  deleteSupplier,
  importSuppliers,
  downloadTemplate,
  upload
};
