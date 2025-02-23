import mongoose from "mongoose";

const outOrderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: [true, "Product is required"],
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: [true, "Customer is required"],
  },
  out_price: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => value >= 0,
      message: "Price must be a number and greater than or equal to zero",
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
  receiver: {
    type: String,
    required: [true, "Receiver is required"],
  },
  invoice: {
    type: String,
    required: [true, "Invoice is required"],
  },
}, {
  timestamps: true,
});

const OutOrders = mongoose.model("OutOrders", outOrderSchema);

export default OutOrders;
