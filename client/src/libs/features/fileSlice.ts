import { baseApiUrl, dropItToken } from "@/constants/values";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseApiUrl}api/files/` }),
  refetchOnFocus: true,
  tagTypes: ["File"],
  endpoints: (builder) => ({
    getFiles: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${dropItToken}`,
        },
      }),
    }),
    uploadFile: builder.mutation({
      query: (formData: FormData) => ({
        url: "upload/",
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${dropItToken}`,
        },
      }),
    }),
  }),
});

export const { useGetFilesQuery, useUploadFileMutation } = fileApi;
