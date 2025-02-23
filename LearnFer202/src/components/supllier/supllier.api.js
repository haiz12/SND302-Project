import axios from "../../services/axios.customize";

const SupllierAPI = (current, pageSize) => {
  const URL_BACKEND = `suppliers?current=${current}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const deleteSupplierAPI = (id) => {
  const URL_BACKEND = `suppliers/${id}`; //backtick
  return axios.delete(URL_BACKEND);
};

const updateSupplierAPI = (
  _id,
  code,
  name,
  description,
  phone,
  address,
  email,
  website
) => {
  const URL_BACKEND = `suppliers/${_id}`;
  const data = {
    code,
    name,
    description,
    phone,
    address,
    email,
    website,
  };
  return axios.put(URL_BACKEND, data);
};
const createSupplierAPI = async (
  code,
  name,
  description,
  phone,
  address,
  email,
  website,
  logo // Added logo parameter
) => {
  const URL_BACKEND = "suppliers";
  const data = {
    code,
    name,
    description,
    phone,
    address,
    email,
    website,
    logo: { url: logo, caption: name }, // Add the logo to the request payload
  };

  try {
    const response = await axios.post(URL_BACKEND, data);
    return response;
  } catch (error) {
    console.error("Error creating supplier:", error);
    return { message: error.response?.data?.message || "An error occurred" };
  }
};

export { SupllierAPI, deleteSupplierAPI, updateSupplierAPI, createSupplierAPI };
