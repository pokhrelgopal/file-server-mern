import { baseApiUrl } from "@/constants/values";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseApiUrl}api/files/`,
    prepareHeaders: (headers, { getState }) => {
      const secretKey = (getState() as RootState).key.secretKey;
      if (secretKey) {
        headers.set("Authorization", `Bearer ${secretKey}`);
      }
      return headers;
    },
  }),
  refetchOnFocus: true,
  tagTypes: ["File"],
  endpoints: (builder) => ({
    getFiles: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["File"],
    }),
    uploadFile: builder.mutation({
      query: (formData: FormData) => ({
        url: "upload/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["File"],
    }),
    deleteFile: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["File"],
    }),
  }),
});

export const {
  useGetFilesQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
} = fileApi;
