import Products from "../models/product.js";
import Suppliers from '../models/supplier.js'; 
import xlsx from "xlsx";
// Create
const create = async ({
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
}) => {
  try {
    // Create new product
    const newProduct = await Products.create({
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
    // Return newProduct object
    return newProduct._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};
const importExcel = async (file) => {
  try {
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Lấy tất cả supplier codes để validate
    const suppliers = await Suppliers.find({}, 'code _id');
    const supplierMap = new Map(suppliers.map(s => [s.code, s._id]));

    // Validate và transform data
    const productsToInsert = [];
    const errors = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2; // Excel bắt đầu từ hàng 2 (sau header)
      
      // Kiểm tra supplier code có tồn tại
      const supplierCode = row['Nhà Cung Cấp'];
      const supplierId = supplierMap.get(supplierCode);
      
      if (!supplierId) {
        errors.push(`Dòng ${rowNumber}: Mã nhà cung cấp "${supplierCode}" không tồn tại`);
        continue;
      }

      // Validate required fields
      if (!row['Code']) {
        errors.push(`Dòng ${rowNumber}: Thiếu mã sản phẩm`);
        continue;
      }
      if (!row['Tên sản phẩm']) {
        errors.push(`Dòng ${rowNumber}: Thiếu tên sản phẩm`);
        continue; 
      }

      // Transform data
      const product = {
        code: row['Code'],
        name: row['Tên sản phẩm'],
        supplier: supplierId, // Gán ObjectId của supplier
        description: row['Mô tả'] || '',
        size: row['Kích Thước'] || '',
        material: row['Chất liệu'] || '',
        quantity: 0,
        in_price: 0,
        out_price: 0,
      };

      productsToInsert.push(product);
    }

    // Nếu có lỗi, throw error với danh sách lỗi
    if (errors.length > 0) {
      throw new Error(`Lỗi import:\n${errors.join('\n')}`);
    }

    // Insert data nếu không có lỗi
    const result = await Products.insertMany(productsToInsert);

    return {
      success: true,
      message: `Đã import thành công ${result.length} sản phẩm`,
      data: result
    };

  } catch (error) {
    throw new Error(`Import thất bại: ${error.message}`);
  }
};

const generateTemplate = () => {
  try {
    const workbook = xlsx.utils.book_new();
    
    const templateData = [
      {
        'Code': 'SP001',
        'Tên sản phẩm': 'Tên sản phẩm mẫu',
        'Nhà Cung Cấp': 'NCC001', 
        'Mô tả': 'Mô tả sản phẩm',
        'Kích Thước': 'M',
        'Chất liệu': 'Cotton'
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Điều chỉnh độ rộng cột
    worksheet['!cols'] = [
      { wch: 15 },  // Code
      { wch: 40 },  // Tên sản phẩm
      { wch: 20 },  // Nhà Cung Cấp
      { wch: 40 },  // Mô tả  
      { wch: 15 },  // Kích Thước
      { wch: 20 },  // Chất liệu
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return buffer;
  } catch (error) {
    throw new Error(`Tạo template thất bại: ${error.message}`);
  }
};


const list = async (current = 1, pageSize = 10) => {
  try {
    const skip = (current - 1) * pageSize; // Calculate the number of records to skip
    const total = await Products.countDocuments(); // Total number of records
    const products = await Products.find({})
      .skip(skip) // Skip previous records
      .limit(pageSize) // Limit the number of records returned
      .exec();

    return {
      products,
      total,
      totalPages: Math.ceil(total / pageSize), // Calculate total pages
      currentPage: current, // Current page
      pageSize, // Records per page
    };
  } catch (error) {
    throw new Error(`Error fetching suppliers: ${error.message}`);
  }
};

// Get single Product by Id
const getById = async (id) => {
  try {
    return await Products.findOne({ _id: id }).populate("supplier").exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

//search by suppliers
const getBySupplier = async (code) => {
  try {
    return await Products.findMany({ supplier: supplier })
      .populate("suppliers")
      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

// search by code
const getByCode = async (id) => {
  try {
    return await Products.findOne({ code: code }).populate("supplier").exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const edit = async (
  id,
  {
    images,
    supplier,
    description,
    quantity,
    size,
    material,
    in_price,
    out_price,
  }
) => {
  try {
    return await Products.findByIdAndUpdate(
      { _id: id },
      {
        images,
        supplier,
        description,
        quantity,
        size,
        material,
        in_price,
        out_price,
      },
      { new: true }
    );
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteProduct = async (id) => {
  try {
    return await Products.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};


export default {
  create,
  list,
  getById,
  edit,
  deleteProduct,
  getByCode,
  getBySupplier,
  importExcel,
  generateTemplate
};
