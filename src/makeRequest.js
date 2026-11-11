import axios from "axios";
import { API_URL } from "./config/api";

const makeRequest = axios.create({
  baseURL: API_URL,
});

export default makeRequest;
