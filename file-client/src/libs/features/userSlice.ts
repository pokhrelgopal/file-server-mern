import { baseApiUrl } from "@/constants/values";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface SignupResponse {
  message: string;
  status: number;
}
export interface LoginResponse {
  message: string;
  status: number;
}
export interface OtpVerifyResponse {
  message: string;
  status: number;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseApiUrl}api/auth/` }),
  refetchOnFocus: true,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    signup: builder.mutation<
      SignupResponse,
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: "signup/",
        method: "POST",
        body: { email, password },
      }),
    }),
    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: ({ email, password }) => ({
          url: "login/",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }),
      }
    ),
    otpVerify: builder.mutation<
      OtpVerifyResponse,
      { email: string; otp: string }
    >({
      query: ({ email, otp }) => ({
        url: "validate-otp/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useOtpVerifyMutation } =
  userApi;
