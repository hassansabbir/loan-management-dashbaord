import { api } from "../api/baseApi";

export interface LoanApplicationCardStats {
  pendingReview: number;
  approved: number;
  totalFundingVolume: number;
  riskRejections: number;
}

export interface BusinessDetails {
  legalName: string;
  crn: string;
  storeUrl?: string;
  industrySector: string;
  yearsInBusiness: number;
  registeredAddress: string;
}

export interface Financials {
  avgMonthlyRevenue: number;
  annualTurnover: number;
  primarySalesChannel?: string;
  monthlySalesVolume?: number;
  purpose?: string;
}

export interface BankingDetails {
  bankName: string;
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  iban?: string;
}

export interface Documents {
  certificateOfIncorporation?: string;
  ownersPhotoId?: string;
  bankStatements?: string[];
  vatReturns?: string[];
}

export interface ApprovedTerms {
  durationMonths: number;
  interestRate: number;
  repaymentPercentage: number;
}

export interface LoanApplication {
  _id: string;
  businessDetails: BusinessDetails;
  financials: Financials;
  bankingDetails: BankingDetails;
  documents?: Documents;
  approvedTerms?: ApprovedTerms;
  borrowerId?: any;
  status: "APPROVED" | "PENDING" | "REJECTED" | "UNDER_REVIEW" | string;
  requestedAmount: number;
  approvedAmount?: number;
  reviewNotes?: string;
  declarationsConfirm?: boolean;
  termsAgree?: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoanApplicationsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: LoanApplication[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const loanSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Applications Stat Cards: GET /loans/admin/applications-cards
    getLoanApplicationsCards: builder.query<
      { success: boolean; message: string; statusCode: number; data: LoanApplicationCardStats },
      void
    >({
      query: () => ({
        method: "GET",
        url: "/loans/admin/applications-cards",
      }),
      providesTags: ["Applications"],
    }),

    // 2. Loan Applications List: GET /loans/admin/applications?page=1&limit=10
    getLoanApplications: builder.query<
      LoanApplicationsResponse,
      { page?: number; limit?: number; status?: string; searchTerm?: string } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", String(params.page));
        if (params?.limit) query.append("limit", String(params.limit));
        if (params?.status && params.status !== "All") {
          query.append("status", params.status.toUpperCase());
        }
        if (params?.searchTerm) query.append("searchTerm", params.searchTerm);
        const qs = query.toString();
        return {
          method: "GET",
          url: `/loans/admin/applications${qs ? `?${qs}` : ""}`,
        };
      },
      providesTags: ["Applications"],
    }),

    // 3. Application by ID: GET /loans/admin/applications/:id
    getLoanApplicationById: builder.query<{ success: boolean; data: LoanApplication }, string>({
      query: (id) => ({
        method: "GET",
        url: `/loans/admin/applications/${id}`,
      }),
      providesTags: ["Applications"],
    }),

    // 4. Review Application (Approve or Reject): PATCH /loans/admin/applications/:id/review
    reviewLoanApplication: builder.mutation<
      any,
      {
        id: string;
        status: "APPROVED" | "REJECTED" | string;
        approvedAmount?: number;
        approvedTerms?: {
          durationMonths: number;
          interestRate: number;
          repaymentPercentage: number;
        };
        reviewNotes?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        method: "PATCH",
        url: `/loans/admin/applications/${id}/review`,
        body,
      }),
      invalidatesTags: ["Applications", "DashboardOverview"],
    }),

    updateLoanApplicationStatus: builder.mutation<
      any,
      {
        id: string;
        status: "APPROVED" | "REJECTED" | string;
        approvedAmount?: number;
        approvedTerms?: {
          durationMonths: number;
          interestRate: number;
          repaymentPercentage: number;
        };
        reviewNotes?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        method: "PATCH",
        url: `/loans/admin/applications/${id}/review`,
        body,
      }),
      invalidatesTags: ["Applications", "DashboardOverview"],
    }),
  }),
});

export const {
  useGetLoanApplicationsCardsQuery,
  useGetLoanApplicationsQuery,
  useGetLoanApplicationByIdQuery,
  useReviewLoanApplicationMutation,
  useUpdateLoanApplicationStatusMutation,
} = loanSlice;

export default loanSlice;
