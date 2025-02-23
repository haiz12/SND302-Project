import Customers from "../models/customer.js";

const createCustomer = async ({ name, phone, email, address }) => {
  try {
    const newCustomer = await Customers.create({
      name,
      phone,
      email,
      address,
    });
    return newCustomer._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const listCustomer = async (current = 1, pageSize = 10) => {
    try {
      const skip = (current - 1) * pageSize; // Calculate the number of records to skip
      const total = await Customers.countDocuments(); // Total number of records
      const customers = await Customers.find({})
        .skip(skip) // Skip previous records
        .limit(pageSize) // Limit the number of records returned
        .exec();
  
      return {
        customers,
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
    return await Customers.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const edit = async (id, { name, phone, email, address }) => {
  try {
    return await Customers.findByIdAndUpdate(
      { _id: id },
      {
        name,
        phone,
        email,
        address,
      },
      { new: true }
    );
  } catch (error) {
    throw new Error(error.toString());
  }
};
const deleteCustomer = async (id) => {
  try {
    return await Customers.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default {
  createCustomer,
  listCustomer,
  getById,
  edit,
  deleteCustomer,
};
