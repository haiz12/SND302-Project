import inOrders from "../models/inOrder.js";
import Product from "../models/product.js";
import Supplier from "../models/supplier.js";
import Account from "../models/account.js";
import xlsx from "xlsx";

const create = async ({
  product,
  supplier,
  in_price,
  quantity_real,
  quantity_doc,
  staff,
  deliver,
  invoice,
}) => {
  try {
    // Create new outOrder
    const newinOrder = await inOrders.create({
      product,
      supplier,
      in_price,
      quantity_real,
      quantity_doc,
      staff,
      deliver,
      invoice,
    });
    // Return newoutOrder object
    return newinOrder._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Get all
const list = async (current = 1, pageSize = 10) => {
  try {
    const skip = (current - 1) * pageSize; // Calculate the number of records to skip
    const total = await inOrders.countDocuments(); // Total number of records
    const in_orders = await inOrders
      .find({})
      .populate("product")
      .populate("supplier")
      .skip(skip) // Skip previous records
      .limit(pageSize) // Limit the number of records returned
      .exec();

    return {
      in_orders,
      total,
      totalPages: Math.ceil(total / pageSize), // Calculate total pages
      currentPage: current, // Current page
      pageSize, // Records per page
    };
  } catch (error) {
    throw new Error(`Error fetching suppliers: ${error.message}`);
  }
};

// Get single outOrder by Id
const getById = async (id) => {
  try {
    return await inOrders
      .findOne({ _id: id })
      .populate("product")
      .populate("supplier")

      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const importExcel = async (file) => {
  try {
    let workbook, worksheet, jsonData;
    
    try {
      workbook = xlsx.read(file.buffer, { type: "buffer" });
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      jsonData = xlsx.utils.sheet_to_json(worksheet);
    } catch (error) {
      throw new Error('File không đúng định dạng Excel');
    }

    // Kiểm tra file rỗng
    if (!jsonData || jsonData.length === 0) {
      throw new Error('File không có dữ liệu');
    }

    // Kiểm tra số lượng cột
    const requiredColumns = ['Mã sản phẩm', 'Mã nhà cung cấp', 'Giá nhập', 'Số lượng thực', 'Số lượng chứng từ'];
    const missingColumns = requiredColumns.filter(col => !Object.keys(jsonData[0]).includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`File thiếu các cột bắt buộc: ${missingColumns.join(', ')}`);
    }

    const inOrdersToInsert = [];
    const errors = [];
    const productCodes = new Set();

    // Lấy danh sách products, suppliers và accounts để kiểm tra
    const products = await Product.find({}).populate('supplier', 'code');
    const suppliers = await Supplier.find({}, 'code');
    const accounts = await Account.find({}, 'username');
    
    const productMap = new Map(products.map(p => [p.code, { id: p._id, supplier: p.supplier }]));
    const supplierMap = new Map(suppliers.map(s => [s.code, s._id]));
    const accountMap = new Map(accounts.map(a => [a.username, a._id]));

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2;

      // Kiểm tra trùng lặp
      if (productCodes.has(row['Mã sản phẩm'])) {
        errors.push(`Dòng ${rowNumber}: Mã sản phẩm "${row['Mã sản phẩm']}" bị trùng lặp`);
        continue;
      }
      productCodes.add(row['Mã sản phẩm']);

      // Validate required fields
      if (!row['Mã sản phẩm']) {
        errors.push(`Dòng ${rowNumber}: Thiếu mã sản phẩm`);
        continue;
      }
      if (!row['Mã nhà cung cấp']) {
        errors.push(`Dòng ${rowNumber}: Thiếu mã nhà cung cấp`);
        continue;
      }
      if (!row['Giá nhập']) {
        errors.push(`Dòng ${rowNumber}: Thiếu giá nhập`);
        continue;
      }
      if (!row['Số lượng thực']) {
        errors.push(`Dòng ${rowNumber}: Thiếu số lượng thực`);
        continue;
      }
      if (!row['Số lượng chứng từ']) {
        errors.push(`Dòng ${rowNumber}: Thiếu số lượng chứng từ`);
        continue;
      }

      // Validate giá trị số
      if (isNaN(Number(row['Giá nhập'])) || Number(row['Giá nhập']) < 0) {
        errors.push(`Dòng ${rowNumber}: Giá nhập phải là số dương`);
        continue;
      }
      if (isNaN(Number(row['Số lượng thực'])) || Number(row['Số lượng thực']) < 0) {
        errors.push(`Dòng ${rowNumber}: Số lượng thực phải là số dương`);
        continue;
      }
      if (isNaN(Number(row['Số lượng chứng từ'])) || Number(row['Số lượng chứng từ']) < 0) {
        errors.push(`Dòng ${rowNumber}: Số lượng chứng từ phải là số dương`);
        continue;
      }

      // Kiểm tra sản phẩm và nhà cung cấp tồn tại
      const product = productMap.get(row['Mã sản phẩm']);
      const supplierId = supplierMap.get(row['Mã nhà cung cấp']);

      if (!product) {
        errors.push(`Dòng ${rowNumber}: Mã sản phẩm "${row['Mã sản phẩm']}" không tồn tại`);
        continue;
      }
      if (!supplierId) {
        errors.push(`Dòng ${rowNumber}: Mã nhà cung cấp "${row['Mã nhà cung cấp']}" không tồn tại`);
        continue;
      }

      // Kiểm tra nhà cung cấp có đúng với nhà cung cấp của sản phẩm không
      if (product.supplier.code !== row['Mã nhà cung cấp']) {
        errors.push(`Dòng ${rowNumber}: Sản phẩm "${row['Mã sản phẩm']}" không thuộc nhà cung cấp "${row['Mã nhà cung cấp']}"`);
        continue;
      }

      // Kiểm tra username có tồn tại không (nếu có)
      let staffId = null;
      if (row['Username']) {
        staffId = accountMap.get(row['Username']);
        if (!staffId) {
          errors.push(`Dòng ${rowNumber}: Username "${row['Username']}" không tồn tại`);
          continue;
        }
      }

      const inOrder = {
        product: product.id,
        supplier: supplierId,
        in_price: Number(row['Giá nhập']),
        quantity_real: Number(row['Số lượng thực']), 
        quantity_doc: Number(row['Số lượng chứng từ']),
        staff: staffId,
        deliver: row['Người giao hàng'] || '',
        invoice: row['Số hóa đơn'] || ''
      };

      inOrdersToInsert.push(inOrder);
    }

    if (errors.length > 0) {
      throw new Error(`Lỗi import:\n${errors.join('\n')}`);
    }

    let insertedDocs = null;

    try {
      // Insert tất cả đơn nhập
      insertedDocs = await inOrders.insertMany(inOrdersToInsert);
      
      // Cập nhật từng sản phẩm
      for (const inOrder of inOrdersToInsert) {
        await Product.findByIdAndUpdate(
          inOrder.product,
          {
            $inc: { quantity: inOrder.quantity_real },
            $set: { in_price: inOrder.in_price }
          }
        );
      }

      return {
        success: true,
        message: `Đã import thành công ${inOrdersToInsert.length} đơn nhập hàng`,
        data: inOrdersToInsert
      };

    } catch (error) {
      // Nếu có lỗi, thực hiện rollback thủ công
      if (insertedDocs) {
        await inOrders.deleteMany({ _id: { $in: insertedDocs.map(doc => doc._id) } });
      }
      throw error;
    }

  } catch (error) {
    throw new Error(`Import thất bại: ${error.message}`);
  }
};
const generateTemplate = () => {
  try {
    const workbook = xlsx.utils.book_new();
    
    // Thêm comment cho các cột
    const comments = {
      'A1': { author: '', text: 'Mã sản phẩm (Bắt buộc)' },
      'B1': { author: '', text: 'Mã nhà cung cấp (Bắt buộc)' },
      'C1': { author: '', text: 'Giá nhập (Bắt buộc, phải là số dương)' },
      'D1': { author: '', text: 'Số lượng thực (Bắt buộc, phải là số dương)' },
      'E1': { author: '', text: 'Số lượng chứng từ (Bắt buộc, phải là số dương)' },
      'F1': { author: '', text: 'Username (Không bắt buộc)' },
      'G1': { author: '', text: 'Người giao hàng (Không bắt buộc)' },
      'H1': { author: '', text: 'Số hóa đơn (Không bắt buộc)' }
    };

    const templateData = [
      {
        'Mã sản phẩm': 'SP001',
        'Mã nhà cung cấp': 'NCC001', 
        'Giá nhập': 100000,
        'Số lượng thực': 10,
        'Số lượng chứng từ': 10,
        'Username': 'username123',
        'Người giao hàng': 'Nguyễn Văn A',
        'Số hóa đơn': 'HD001'
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Thêm comments vào worksheet
    worksheet['!comments'] = comments;

    // Định dạng độ rộng cột
    worksheet['!cols'] = [
      { wch: 15 },  // Mã sản phẩm
      { wch: 15 },  // Mã nhà cung cấp
      { wch: 15 },  // Giá nhập
      { wch: 15 },  // Số lượng thực
      { wch: 20 },  // Số lượng chứng từ
      { wch: 15 },  // Username
      { wch: 20 },  // Người giao hàng
      { wch: 15 },  // Số hóa đơn
    ];

    // Thêm style cho header
    const header = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'];
    header.forEach(cell => {
      if (!worksheet[cell]) worksheet[cell] = {};
      worksheet[cell].s = {
        fill: { fgColor: { rgb: "FFFF00" } },
        font: { bold: true }
      };
    });

    xlsx.utils.book_append_sheet(workbook, worksheet, 'InOrders');

    return xlsx.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      cellStyles: true
    });
  } catch (error) {
    throw new Error(`Tạo template thất bại: ${error.message}`);
  }
};

const edit = async (id, { in_price, quantity_real, quantity_doc }) => {
  try {
    return await inOrders.findByIdAndUpdate(
      id,
      {
        in_price,
        quantity_real,
        quantity_doc,
      },
      { new: true }
    );
  } catch (error) {
    throw new Error(error.toString());
  }
};
const del = async (id) => {
  try {
    return await inOrders.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};
const getByProductId = async (productId) => {
  try {
    return await inOrders
      .findMany({ product: productId })
      .populate("product")
      .populate("supplier")

      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};
const getByInvoice = async (invoice) => {
  try {
    return await outOrders
      .findMany({ invoice: invoice })
      .populate("product")
      .populate("supplier")

      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};
const getBySupplier = async (supplier) => {
  try {
    return await inOrders
      .findMany({ supplier: supplier })
      .populate("product")
      .populate("supplier")

      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};
const getByDate = async (date) => {
  try {
    // Calculate the start and end date of the specific day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Start from 00:00:00
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // End at 23:59:59.999

    // Get out orders within the range from startDate to endDate
    return await inOrders
      .find({
        createdAt: { $gte: startDate, $lte: endDate }, // Use $gte and $lte to get orders within this time range
      })
      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};
const getByMonth = async (year, month) => {
  try {
    // Calculate the start and end date of the specific month
    const startDate = new Date(year, month - 1, 1); // Tháng bắt đầu từ 0
    const endDate = new Date(year, month, 0); // Lấy ngày cuối cùng của tháng

    // Get out orders within the range from startDate to endDate
    return await inOrders
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};
export default {
  create,
  list,
  getById,
  edit,
  del,
  getByProductId,
  getByInvoice,
  getBySupplier,
  getByDate,
  getByMonth,
  importExcel,
  generateTemplate
};
