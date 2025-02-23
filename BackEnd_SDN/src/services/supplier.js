import Suppliers from "../models/supplier.js";
import xlsx from "xlsx";
// Create
const create = async ({
  code,
  name,
  logo,
  description,
  phone ,
  address,
  email,
  website,
}) => {
  try {

    const newSuppliers = await Suppliers.create({
      code,
      name,
      logo,
      description,
      phone,
      address,
      email,
      website,
    });

    return newSuppliers._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};
const importExcel = async (file) => {
  try {
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Validate và transform data
    const suppliersToInsert = [];
    const errors = [];

    // Kiểm tra mã code trùng lặp trong database
    const existingCodes = await Suppliers.find({}, 'code');
    const existingCodeSet = new Set(existingCodes.map(s => s.code));

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2; // Excel bắt đầu từ hàng 2 (sau header)
      
      // Validate required fields
      if (!row['Code']) {
        errors.push(`Dòng ${rowNumber}: Thiếu mã nhà cung cấp`);
        continue;
      }
      if (!row['Tên nhà cung cấp']) {
        errors.push(`Dòng ${rowNumber}: Thiếu tên nhà cung cấp`);
        continue;
      }
      if (!row['Số điện thoại']) {
        errors.push(`Dòng ${rowNumber}: Thiếu số điện thoại`);
        continue;
      }

      // Kiểm tra mã code trùng lặp
      if (existingCodeSet.has(row['Code'])) {
        errors.push(`Dòng ${rowNumber}: Mã nhà cung cấp "${row['Code']}" đã tồn tại`);
        continue;
      }

      // Validate email format
      if (row['Email'] && !isValidEmail(row['Email'])) {
        errors.push(`Dòng ${rowNumber}: Email không hợp lệ`);
        continue;
      }

      // Transform data
      const supplier = {
        code: row['Code'],
        name: row['Tên nhà cung cấp'],
        phone: row['Số điện thoại'],
        address: row['Địa chỉ'] || '',
        email: row['Email'] || '',
        website: row['Website'] || '',
        description: row['Mô tả'] || '',
        logo: [{ // Thêm logo array với giá trị mặc định
          url: '',
          caption: ''
        }]
      };

      suppliersToInsert.push(supplier);
    }

    // Nếu có lỗi, throw error với danh sách lỗi
    if (errors.length > 0) {
      throw new Error(`Lỗi import:\n${errors.join('\n')}`);
    }

    // Insert data nếu không có lỗi
    const result = await Suppliers.insertMany(suppliersToInsert);

    return {
      success: true,
      message: `Đã import thành công ${result.length} nhà cung cấp`,
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
        'Code': 'NCC001',
        'Tên nhà cung cấp': 'Công ty TNHH ABC',
        'Số điện thoại': '0123456789',
        'Địa chỉ': '123 Đường ABC, Quận XYZ, TP.HCM',
        'Email': 'example@company.com',
        'Website': 'www.company.com',
        'Mô tả': 'Mô tả về nhà cung cấp'
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Điều chỉnh độ rộng cột
    worksheet['!cols'] = [
      { wch: 15 },  // Code
      { wch: 40 },  // Tên nhà cung cấp
      { wch: 20 },  // Số điện thoại
      { wch: 50 },  // Địa chỉ
      { wch: 30 },  // Email
      { wch: 30 },  // Website
      { wch: 50 },  // Mô tả
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Suppliers');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return buffer;
  } catch (error) {
    throw new Error(`Tạo template thất bại: ${error.message}`);
  }
};

// Hàm phụ trợ để validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
// Get all
const list = async (current = 1, pageSize = 10) => {
  try {
    const skip = (current - 1) * pageSize; // Calculate the number of records to skip
    const total = await Suppliers.countDocuments(); // Total number of records
    const suppliers = await Suppliers.find({})
      .skip(skip) // Skip previous records
      .limit(pageSize) // Limit the number of records returned
      .exec();

    return {
      suppliers,
      total,
      totalPages: Math.ceil(total / pageSize), // Calculate total pages
      currentPage: current, // Current page
      pageSize, // Records per page
    };
  } catch (error) {
    throw new Error(`Error fetching suppliers: ${error.message}`);
  }
};



const getById = async (id) => {
  try {
    return await Suppliers.findOne({ _id: id })
      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const edit = async (
  id,
  { name, description, phone, address, email, website}
) => {
  try {
    return await Suppliers.findByIdAndUpdate(
      { _id: id },
      { name, description, phone, address, email, website },
      { new: true }
    );
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteProduct = async (id) => {
  try {
    return await Suppliers.findByIdAndDelete({ _id: id });
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
  importExcel,
  generateTemplate
};
