import { baseApi } from "../api";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params?: { role?: string; location?: string }) => {
        return {
          url: `/employees`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Users"],
    }),
    addUser: builder.mutation({
      query: (newDevice) => ({
        url: "/employees",
        method: "POST",
        body: newDevice,
      }),
      invalidatesTags: ["Users" , "Devices"],
    }),
  }),
});

export const { useAddUserMutation, useGetUsersQuery } = usersApi;
