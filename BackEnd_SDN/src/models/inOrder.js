import mongoose from "mongoose";

const inOrderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: [true, "Product is required"],
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "suppliers",
    required: [true, "Supplier is required"],
  },
  in_price: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => value >= 0,
      message: "Price must be a number and greater than or equal zero",
    },
  },
  quantity_real: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => value >= 0,
      message: "Quantity must be greater than or equal to zero",
    },
  },
  quantity_doc: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => value >= 0,
      message: "Quantity must be greater than or equal to zero",
    },
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
    required: [true, "Staff is required"],
  },
  deliver: {
    type: String,
    required: [true, "Deliver is required"],
  },
  invoice: {
    type: String,
    required: [true, "Invoice is required"],
  },
}, {
  timestamps: true,
});

const InOrders = mongoose.model("InOrders", inOrderSchema);

export default InOrders;
