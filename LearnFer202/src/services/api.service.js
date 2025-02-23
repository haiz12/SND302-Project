import axios from "./axios.customize";

const createUserAPI = (name, email, address, phone) => {
  const URL_BACKEND = "customers";
  const data = {
    name: name,
    email: email,
    address: address,
    phone: phone,
  };
  return axios.post(URL_BACKEND, data);
};
const updateUserAPI = (_id, name, email, phone,address) => {
  const URL_BACKEND = `customers/${_id}`; 
  const data = {
    name: name,
    phone: phone,
    email: email,
    address: address
  };
  return axios.put(URL_BACKEND, data);
};
const fetchAllUserAPI = (current, pageSize) => {
  const URL_BACKEND = `customers?current=${current}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const deleteUserAPI = (id) => {
  const URL_BACKEND = `customers/${id}`; //backtick
  return axios.delete(URL_BACKEND);
};
const handleUploadFile = (file, folder) => {
  const URL_BACKEND = `/api/v1/file/upload`;
  let config = {
    headers: {
      "upload-type": folder,
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", file);

  return axios.post(URL_BACKEND, bodyFormData, config);
};

const updateUserAvatarAPI = (avatar, _id, fullName, phone) => {
  const URL_BACKEND = "/api/v1/user";
  const data = {
    _id: _id,
    avatar: avatar,
    fullName: fullName,
    phone: phone,
  };
  return axios.put(URL_BACKEND, data);
};

export {
  createUserAPI,
  updateUserAPI,
  fetchAllUserAPI,
  deleteUserAPI,
  updateUserAvatarAPI,
  handleUploadFile,
};
