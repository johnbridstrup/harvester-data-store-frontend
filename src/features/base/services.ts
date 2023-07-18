import axios from "axios";
import { CSRF_URL, OPENAPI_URL } from "./constants";

interface RequestConfig {
  headers: {
    Accept?: string;
    "Content-Type": string;
    Authorization: string;
    "X-CSRFToken"?: string;
  };
  credentials: string;
}

class AxiosService {
  constructor() {}

  private config: RequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "",
    },
    credentials: "include",
  };

  private authorization(token?: string) {
    const csrftoken = localStorage.getItem("csrftoken") as string;
    if (typeof token === "string" && token.length > 0) {
      this.config.headers["Authorization"] = `Token ${token}`;
    }
    this.config["headers"]["X-CSRFToken"] = csrftoken;
    return this.config;
  }

  public async post(url: string, token?: string, data: object = {}) {
    const config = this.authorization(token);
    const res = await axios.post(url, data, config);
    return res.data;
  }

  public async get(url: string, token?: string) {
    if (typeof token === "string" && token.length > 0) {
      this.config["headers"]["Authorization"] = `Token ${token}`;
    }
    const res = await axios.get(url, this.config);
    return res.data.data;
  }

  public async put(url: string, token?: string, data: object = {}) {
    const config = this.authorization(token);
    const res = await axios.put(url, data, config);
    return res.data;
  }

  public async patch(url: string, token?: string, data: object = {}) {
    const config = this.authorization(token);
    const res = await axios.patch(url, data, config);
    return res.data;
  }

  public async delete(url: string, token: string | null) {
    if (typeof token === "string" && token.length > 0) {
      this.config["headers"]["Authorization"] = `Token ${token}`;
    }
    const res = await axios.delete(url, this.config);
    return res.data;
  }

  public async upload(url: string, token?: string, data: object = {}) {
    const config = this.authorization(token);
    config["headers"]["Content-Type"] = "multipart/form-data";
    const res = await axios.post(url, data, config);
    return res.data;
  }

  public async openapi(url: string, token?: string) {
    if (typeof token === "string" && token.length > 0) {
      this.config["headers"]["Authorization"] = `Token ${token}`;
    }
    const res = await axios.get(url, this.config);
    return res.data;
  }
}

export const axiosService = new AxiosService();

export const persistCSRFToken = async (): Promise<void> => {
  const res = await axiosService.get(CSRF_URL, "");
  let csrftoken = res.data.csrftoken;
  if (typeof csrftoken === "string" && csrftoken.length > 0) {
    localStorage.setItem("csrftoken", csrftoken);
  }
};

export const openapiSchema = async (token: string) => {
  return await axiosService.openapi(OPENAPI_URL, token);
};

export const paginateRequest = async (url: string, token: string) => {
  const response = await axiosService.get(url, token);
  return response;
};
