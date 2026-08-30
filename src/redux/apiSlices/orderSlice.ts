import { api } from "../api/baseApi";

const orderSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    orders: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/dashboard/orders",
        };
      },
    }),
    orderProgress: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/dashboard/order-progress",
        };
      },
    }),
  }),
});

export const { useOrdersQuery, useOrderProgressQuery } = orderSlice;