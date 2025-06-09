import { baseApi } from "../api";

export const devicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query({
      query: (params?: {
        role?: string;
        location?: string;
        status?: "available" | "in use";
      }) => {
        return {
          url: `/devices`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Devices"],
    }),
    addDevice: builder.mutation({
      query: (newDevice) => ({
        url: "/devices",
        method: "POST",
        body: newDevice,
      }),
      invalidatesTags: ["Devices"],
    }),
  }),
});

export const { useGetDevicesQuery, useAddDeviceMutation } = devicesApi;
