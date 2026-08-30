import { api } from "../api/baseApi";

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: FaqItem[];
}

export interface CreateFaqPayload {
  question: string;
  answer: string;
}

export interface UpdateFaqPayload {
  id: string;
  question: string;
  answer: string;
}

export const faqSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get FAQs: GET /faqs/
    getFaqs: builder.query<FaqsResponse, void>({
      query: () => ({
        method: "GET",
        url: "/faqs/",
      }),
      providesTags: ["Faqs"],
    }),

    // 2. Create FAQ: POST /faqs/create
    createFaq: builder.mutation<
      { success: boolean; message: string; data?: FaqItem },
      CreateFaqPayload
    >({
      query: (body) => ({
        method: "POST",
        url: "/faqs/create",
        body,
      }),
      invalidatesTags: ["Faqs"],
    }),

    // 3. Update FAQ: PATCH /faqs/update/:id
    updateFaq: builder.mutation<
      { success: boolean; message: string; data?: FaqItem },
      UpdateFaqPayload
    >({
      query: ({ id, ...body }) => ({
        method: "PATCH",
        url: `/faqs/update/${id}`,
        body,
      }),
      invalidatesTags: ["Faqs"],
    }),

    // 4. Delete FAQ: DELETE /faqs/delete/:id
    deleteFaq: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        method: "DELETE",
        url: `/faqs/delete/${id}`,
      }),
      invalidatesTags: ["Faqs"],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqSlice;

export default faqSlice;
