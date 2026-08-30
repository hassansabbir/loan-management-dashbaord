import { api } from "../api/baseApi";

export interface TransactionBusiness {
  name: string;
  logo?: string;
  address?: string;
}

export interface TransactionItem {
  _id: string;
  createdAt: string;
  transactionId: string;
  type?: "SALE" | "DISBURSEMENT" | string;
  business: TransactionBusiness;
  grossAmount: number;
  repayment: number;
  netPayout: number;
  status: "Succeeded" | "Pending" | "Failed" | string;
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: TransactionItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const transactionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Transactions List: GET /transactions/admin/transactions
    getTransactions: builder.query<
      TransactionsResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        searchTerm?: string;
      } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", String(params.page));
        if (params?.limit) query.append("limit", String(params.limit));

        if (params?.searchTerm && params.searchTerm.trim()) {
          query.append("searchTerm", params.searchTerm.trim());
        }

        // If status is "All" or "all", omit status query parameter
        if (
          params?.status &&
          params.status.trim() &&
          params.status.toLowerCase() !== "all"
        ) {
          query.append("status", params.status.trim());
        }

        const qs = query.toString();
        return {
          method: "GET",
          url: `/transactions/admin/transactions${qs ? `?${qs}` : ""}`,
        };
      },
      providesTags: ["Transactions"],
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionSlice;

export default transactionSlice;
