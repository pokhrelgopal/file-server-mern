import { baseApiUrl } from "@/constants/values";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface KeyResponse {
  secretKey: string;
}

export const keyApi = createApi({
  reducerPath: "keyApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseApiUrl}api/keys/` }),
  refetchOnFocus: true,
  tagTypes: ["Key"],
  endpoints: (builder) => ({
    generateSecretKey: builder.mutation<KeyResponse, void>({
      query: () => ({
        url: "generate-secret-key",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Key"],
    }),
    rollSecretKey: builder.mutation<KeyResponse, void>({
      query: () => ({
        url: "roll-secret-key",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Key"],
    }),
    getSecretKey: builder.query<KeyResponse, void>({
      query: () => ({
        url: "get-secret-key",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Key"],
    }),
  }),
});

export const {
  useGenerateSecretKeyMutation,
  useRollSecretKeyMutation,
  useGetSecretKeyQuery,
} = keyApi;
