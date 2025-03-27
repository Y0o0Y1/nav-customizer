import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: any;
      params?: any;
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || err.message,
        },
      };
    }
  };
