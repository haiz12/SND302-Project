import axios from "../../services/axios.customize";
const OutOrderAPI = (current, pageSize) => {
  const URL_BACKEND = `out?current=${current}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const DeleteOutOrderAPI = (id) => {
  const URL_BACKEND = `out/${id}`;
  return axios.delete(URL_BACKEND);
};
export { OutOrderAPI, DeleteOutOrderAPI };
