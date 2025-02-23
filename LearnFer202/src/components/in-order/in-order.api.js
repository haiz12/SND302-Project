import axios from "../../services/axios.customize";
const InOrderAPI = (current, pageSize) => {
  const URL_BACKEND = `in?current=${current}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};
const DeleteInOrderAPI = (id) => {
  const URL_BACKEND = `in/${id}`;
  return axios.delete(URL_BACKEND);
};
export { InOrderAPI, DeleteInOrderAPI };
