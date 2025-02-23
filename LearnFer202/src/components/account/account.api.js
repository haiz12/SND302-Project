import axios from "../../services/axios.customize";
const ListAccountAPI = (current, pageSize) => {
  const URL_BACKEND = `accounts?current=${current}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const deleteAccountAPI = (id) => {
  const URL_BACKEND = `accounts/${id}`; //backtick
  return axios.delete(URL_BACKEND);
};
const createAccountAPI = async (
  username,
  email,
  password,
  dob,
  gender,
  phoneNumber,
  role_id
) => {
  const URL_BACKEND = "accounts"; // URL backend cần có dạng đầy đủ nếu cần
  const data = {
    username,
    email,
    password,
    dob,
    gender,
    phoneNumber,
    role_id,
  };

  try {
    const response = await axios.post(URL_BACKEND, data);
    return response; // Trả về response nếu thành công
  } catch (error) {
    console.error("Error creating account:", error);
    return { message: error.response?.data?.message || "An error occurred" }; // Trả về thông báo lỗi nếu có
  }
};
const updateAccountAPI = (
  _id,
  username,
  email,
  password,
  dob,
  gender,
  phoneNumber,
  role_id
) => {
  const URL_BACKEND = `accounts/${_id}`;
  const data = {
    username,
    email,
    password,
    dob,
    gender,
    phoneNumber,
    role_id,
  };
  return axios.put(URL_BACKEND, data);
};
export { ListAccountAPI, deleteAccountAPI, createAccountAPI, updateAccountAPI };
