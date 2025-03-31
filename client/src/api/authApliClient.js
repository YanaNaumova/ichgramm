import axios from "axios";

const authApiClient = axios.create({
  baseURL: "https://ichgramm.onrender.com/api",
});

export default authApiClient;
