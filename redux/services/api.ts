import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a base API configuration
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL }),
  endpoints: () => ({}), // No endpoints defined here , will be injected in Separate files
  tagTypes: ["todos", "Devices", "Users"],
});
