import { api } from "../api/baseApi";

const aboutUsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateAboutUs: builder.mutation({
      query: ({ id, description }) => {
        const token = localStorage.getItem("token");
        return {
          url: `/about/update-about/${id}`,
          method: "PATCH",
          body: { description },
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
    }),
    aboutUs: builder.query({
      query: () => {
        const token = localStorage.getItem("token");
        return {
          url: "/about/get-about",
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
          },
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),
  }),
});

export const { useUpdateAboutUsMutation, useAboutUsQuery } = aboutUsSlice;
