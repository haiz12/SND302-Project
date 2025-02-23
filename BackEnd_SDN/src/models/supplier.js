import mongoose from "mongoose";

// Logo schema for supplier logos with base64 validation
const logoSchema = new mongoose.Schema({
  url: {
    type: String,
    default: '' // Thêm giá trị mặc định rỗng    
  },
  caption: {
    type: String,
     default: '' // Thêm giá trị mặc định rỗng
  },
}, {
  timestamps: true,
});

// Supplier schema
const supplierSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Supplier code is required"],
    unique: [true, "Supplier code must be unique"],
  },
  name: {
    type: String,
    trim: true,
    required: [true, "Supplier name is required"],
    unique: [true, "Supplier name must be unique"],
  },
  logo: {
    type: [logoSchema],
    default: [{ url: '', caption: '' }] // Thêm giá trị mặc định
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  website: {
    type: String,
    required: [true, "Website is required"],
  },
}, {
  timestamps: true,
});

// Create Supplier model
const Suppliers = mongoose.model("suppliers", supplierSchema);

// Export model
export default Suppliers;
