import axios from "../../services/axios.customize";
const ListProductAPI = (current, pageSize) => {
  const URL_BACKEND = `products?current=${current}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const deleteProductAPI = (id) => {
  const URL_BACKEND = `products/${id}`; //backtick
  return axios.delete(URL_BACKEND);
};
const SupllierAPIVV = () => {
  const URL_BACKEND = `suppliers`;
  return axios.get(URL_BACKEND);
};
const updateProductAPI = (
  _id,
  code,
  name,
  description,
  size,
  material
) => {
  const URL_BACKEND = `products/${_id}`;
  const data = {
    code,
    name,
    description,
    size,
    material,
    
  };
  return axios.put(URL_BACKEND, data);
};
const createProductAPI = async (code, name, description, size, material, supplier, imageBase64) => {
  const URL_BACKEND = "products";
  const data = {
      code,
      name,
      description,
      size,
      material,
      supplier,
      images: [{ url: `data:image/png;base64,${imageBase64}`, caption: name }],
  };

  try {
      const response = await axios.post(URL_BACKEND, data);
      return response;
  } catch (error) {
      console.error("Error creating product:", error);
      return { message: error.response?.data?.message || "An error occurred" };
  }
};

  const getBySupplier = (_id) => {
    const URL_BACKEND = `suppliers/${_id}`; 
 
    return axios.get(URL_BACKEND);
  };
export { ListProductAPI, deleteProductAPI, updateProductAPI, createProductAPI, getBySupplier, SupllierAPIVV };
