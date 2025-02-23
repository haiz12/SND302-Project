import axios from "../../services/axios.customize";

const loginAPI = (username, password) => {
  const URL_BACKEND = "login";
  const data = {
    username: username,
    password: password,
  };
  return axios.post(URL_BACKEND, data);
};
const accountFromTokenAPI = () => {
  const URL_BACKEND = "login/accounts";
  return axios.get(URL_BACKEND);
}
const logoutAPI = () => {
  const URL_BACKEND = "logout";
  return axios.post(URL_BACKEND);
};
export { loginAPI, logoutAPI, accountFromTokenAPI };
