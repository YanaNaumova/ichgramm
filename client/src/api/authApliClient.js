import axios from "axios";

const authApiClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default authApiClient;
