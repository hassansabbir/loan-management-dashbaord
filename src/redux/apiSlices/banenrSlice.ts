import { api } from "../api/baseApi";

const bannerSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    allBanner: builder.query({
      query: () => {
        return {
          url: `/others/banner`,
          method: "GET",
        };
      },
      providesTags: ["Banner"],
    }),
    getBannerById: builder.query({
      query: (id) => {
        return {
          url: `/others/banner/${id}`,
          method: "GET",
        };
      },
    }),
    addBanner: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/others/add-banner",
          body: data,
        };
      },
      invalidatesTags: ["Banner"],
    }),
    updateBanner: builder.mutation({
      query: ({ data, id }) => {
        return {
          method: "PATCH",
          url: `/others/update-banner/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Banner"],
    }),
    deleteBanner: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/others/banner/${id}`,
        };
      },
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useAllBannerQuery,
  useGetBannerByIdQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerSlice;