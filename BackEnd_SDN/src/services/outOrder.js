import outOrders from "../models/outOrder.js";
import xlsx from "xlsx";
import Product from "../models/product.js";
import Customer from "../models/customer.js";
import Account from "../models/account.js";
const create = async ({
  product,
  customer,
  out_price,
  quantity_real,
  quantity_doc,
  staff,
  receiver,
  invoice,
}) => {
  try {
    // Create new outOrder
    const newoutOrder = await outOrders.create({
      product,
      customer,
      out_price,
      quantity_real,
      quantity_doc,
      staff,
      receiver,
      invoice,
    });
    // Return newoutOrder object
    return newoutOrder._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Get all
const list = async (current = 1, pageSize = 10) => {
  try {
    const skip = (current - 1) * pageSize; // Calculate the number of records to skip
    const total = await outOrders.countDocuments(); // Total number of records
    const out_orders = await outOrders
      .find({})
      .populate("product")
      .populate("customer")
      .skip(skip) // Skip previous records
      .limit(pageSize) // Limit the number of records returned
      .exec();

    return {
      out_orders,
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
    return await outOrders
      .findOne({ _id: id })
      .populate("product")
      .populate("customer")

      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};
const generateTemplate = async () => {
  try {
    // Create workbook and worksheet
    const workbook = xlsx.utils.book_new();
    
    // Define headers
    const headers = [
      'Họ và tên người nhận',
      'Khách hàng',
      'Mã sản phẩm',
      'Số lượng theo chứng từ',
      'Số lượng thực xuất', 
      'Đơn giá',
      'Số hóa đơn',
      'Nhân viên'
    ];

    // Create example data
    const exampleData = [
      {
        'Họ và tên người nhận': 'Nguyễn Văn A',
        'Khách hàng': 'KHACH001',
        'Mã sản phẩm': 'SP001',
        'Số lượng theo chứng từ': 100,
        'Số lượng thực xuất': 98,
        'Đơn giá': 50000,
        'Số hóa đơn': 'HD001',
        'Nhân viên': 'NV001'
      }
    ];

    // Create worksheet data with headers and example
    const wsData = [headers, ...exampleData.map(row => headers.map(header => row[header]))];

    // Create worksheet
    const ws = xlsx.utils.aoa_to_sheet(wsData);

    // Set column widths
    const colWidths = [
      { wch: 25 }, // Họ và tên người nhận
      { wch: 20 }, // Khách hàng
      { wch: 15 }, // Mã sản phẩm
      { wch: 20 }, // Số lượng theo chứng từ
      { wch: 20 }, // Số lượng thực xuất
      { wch: 15 }, // Đơn giá
      { wch: 15 }, // Số hóa đơn
      { wch: 15 }, // Nhân viên
    ];
    ws['!cols'] = colWidths;

    // Style headers
    for (let i = 0; i < headers.length; i++) {
      const cellRef = xlsx.utils.encode_cell({ r: 0, c: i });
      if (!ws[cellRef].s) ws[cellRef].s = {};
      ws[cellRef].s = {
        fill: { fgColor: { rgb: "FFFF00" } },
        font: { bold: true },
        alignment: { horizontal: "center" }
      };
    }

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(workbook, ws, 'Template');

    // Generate buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;

  } catch (error) {
    throw new Error(`Lỗi tạo template: ${error.message}`);
  }
};


const importExcel = async (file) => {
  try {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });

    const results = [];
    const errors = [];
    const processedInvoices = new Set();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Validate required fields
        const requiredFields = ['Họ và tên người nhận', 'Khách hàng', 'Sản phẩm', 'Số lượng thực tế', 'Số lượng chứng từ', 'Giá xuất', 'Số hóa đơn', 'Nhân viên'];
        for (const field of requiredFields) {
          if (!row[field] || row[field].toString().trim() === '') {
            throw new Error(`Thiếu thông tin: ${field}`);
          }
        }

        // Check duplicate invoice
        const invoice = row['Số hóa đơn'].trim();
        if (processedInvoices.has(invoice)) {
          throw new Error(`Số hóa đơn trùng lặp: ${invoice}`);
        }
        processedInvoices.add(invoice);

        // Find customer
        const customer = await Customer.findOne({ 
          name: { $regex: new RegExp('^' + row['Khách hàng'].trim() + '$', 'i') }
        });
        if (!customer) {
          throw new Error(`Không tìm thấy khách hàng: ${row['Khách hàng']}`);
        }

        // Find product
        const product = await Product.findOne({ 
          name: { $regex: new RegExp('^' + row['Sản phẩm'].trim() + '$', 'i') }
        });
        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm: ${row['Sản phẩm']}`);
        }

        // Find staff
        const staffName = row['Nhân viên'].trim();
        const staff = await Account.findOne({ 
          name: { $regex: new RegExp('^' + staffName + '$', 'i') }
        });
        if (!staff) {
          throw new Error(`Không tìm thấy nhân viên: ${staffName}`);
        }

        // Parse quantities and price
        const quantity_real = parseFloat(row['Số lượng thực tế']);
        const quantity_doc = parseFloat(row['Số lượng chứng từ']);
        const out_price = parseFloat(row['Giá xuất']);

        if (isNaN(quantity_real) || quantity_real <= 0) {
          throw new Error('Số lượng thực tế không hợp lệ');
        }
        if (isNaN(quantity_doc) || quantity_doc <= 0) {
          throw new Error('Số lượng chứng từ không hợp lệ');
        }
        if (isNaN(out_price) || out_price <= 0) {
          throw new Error('Giá xuất không hợp lệ');
        }

        // Create out order
        const outOrder = await OutOrders.create({
          receiver: row['Họ và tên người nhận'].trim(),
          customer: customer._id,
          product: product._id,
          quantity_real,
          quantity_doc,
          out_price,
          invoice: invoice,
          staff: staff._id
        });

        results.push({
          row: i + 2,
          data: outOrder
        });

      } catch (error) {
        errors.push({
          row: i + 2,
          error: error.message,
          data: row
        });
      }
    }

    return {
      success: results.length,
      failed: errors.length,
      errors,
      results
    };

  } catch (error) {
    throw new Error(`Lỗi import Excel: ${error.message}`);
  }
};

const edit = async (
  id,
  {
    product,
    customer,
    out_price,
    quantity_real,
    quantity_doc,
    staff,
    receiver,
    invoice,
  }
) => {
  try {
    const oldOutOrder = await outOrders.findById(id);
    if (!oldOutOrder) {
      throw new Error("Không tìm thấy đơn xuất");
    }

    const quantityDiff = quantity_real - oldOutOrder.quantity_real;

    const updatedOutOrder = await outOrders.findByIdAndUpdate(
      id,
      {
        product,
        customer,
        out_price,
        quantity_real,
        quantity_doc,
        staff,
        receiver,
        invoice,
      },
      { new: true }
    );

    await Product.findByIdAndUpdate(product, {
      $inc: { quantity: -quantityDiff }, 
      $set: { out_price: out_price }, 
    });

    return updatedOutOrder;
  } catch (error) {
    throw new Error(error.toString());
  }
};
const deleteoutOrder = async (id) => {
  try {
    return await outOrders.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};
const getByProductId = async (productId) => {
  try {
    return await outOrders
      .findMany({ product: productId })
      .populate("product")
      .populate("customer")

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
      .populate("customer")

      .exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};
const getByCustomer = async (supplier) => {
  try {
    return await outOrders
      .findMany({ customer: supplier })
      .populate("product")
      .populate("customer")

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
    return await outOrders
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
    return await outOrders
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
  deleteoutOrder,
  getByProductId,
  getByInvoice,
  getByCustomer,
  getByDate,
  getByMonth,
  importExcel,
  generateTemplate
};
