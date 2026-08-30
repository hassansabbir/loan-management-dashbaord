import { api } from "../api/baseApi";

export interface BorrowerCardStats {
  activeBorrowers: number;
  avgRepaymentRate: number;
  totalPortfolioValue: number;
}

export interface BorrowerBusinessDetails {
  legalName: string;
  crn: string;
  storeUrl?: string;
  industrySector: string;
  yearsInBusiness: number;
  registeredAddress: string;
}

export interface BorrowerFinancials {
  avgMonthlyRevenue: number;
  annualTurnover: number;
  primarySalesChannel?: string;
  monthlySalesVolume?: number;
  purpose?: string;
}

export interface BorrowerBankingDetails {
  bankName: string;
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  iban?: string;
}

export interface BorrowerLoanDetails {
  totalFunding: number;
  outstanding: number;
  repaymentPercentage: number;
  repaymentProgress: number;
}

export interface BorrowerUser {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt?: string;
}

export interface BorrowerItem {
  _id: string;
  businessDetails: BorrowerBusinessDetails;
  financials: BorrowerFinancials;
  bankingDetails: BorrowerBankingDetails;
  primaryContact?: {
    businessEmail?: string;
    fullName?: string;
    phoneNumber?: string;
  };
  userId?: BorrowerUser;
  stripeAccountId?: string;
  stripeOnboardingComplete?: boolean;
  loanDetails?: BorrowerLoanDetails;
  status: "Active" | "Inactive" | "Suspended" | string;
  createdAt?: string;
  updatedAt?: string;
  documents?: {
    certificateOfIncorporation?: string;
    ownersPhotoId?: string;
    bankStatements?: string[];
    vatReturns?: string[];
  };
}

export interface LoanProgress {
  totalPaid: number;
  remainingAmount: number;
  percentRepaid: number;
  avgMonthlyPayment: number;
  disbursedDate: string;
  repaymentRate: number;
  principalAmount: number;
}

export interface TrendChartItem {
  month: string;
  revenue: number;
  repayment: number;
}

export interface RepaymentTransaction {
  _id: string;
  loanId: string;
  borrowerId: string;
  paymentId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  stripeChargeId?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SingleBorrowerDetailsData {
  borrower: BorrowerItem;
  loanProgress: LoanProgress;
  trendChart: TrendChartItem[];
  repaymentTransactions: {
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: RepaymentTransaction[];
  };
}

export interface BorrowersResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: BorrowerItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const borrowerSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Borrower Overview Cards: GET /borrowers/admin/borrowers-cards
    getBorrowerCards: builder.query<
      { success: boolean; message: string; statusCode: number; data: BorrowerCardStats },
      void
    >({
      query: () => ({
        method: "GET",
        url: "/borrowers/admin/borrowers-cards",
      }),
      providesTags: ["Borrowers"],
    }),

    // 2. Borrowers List: GET /borrowers/admin/borrowers
    getBorrowers: builder.query<
      BorrowersResponse,
      {
        page?: number;
        limit?: number;
        searchTerm?: string;
        status?: string;
        dateRange?: string;
      } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", String(params.page));
        if (params?.limit) query.append("limit", String(params.limit));

        if (params?.dateRange && params.dateRange !== "all") {
          query.append("dateRange", params.dateRange);
        }

        if (params?.searchTerm && params.searchTerm.trim()) {
          query.append("searchTerm", params.searchTerm.trim());
        }

        // IMPORTANT RULE: If status is "All" or "all", DO NOT send status at all!
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
          url: `/borrowers/admin/borrowers${qs ? `?${qs}` : ""}`,
        };
      },
      providesTags: ["Borrowers"],
    }),

    // 3. Single Borrower Details: GET /borrowers/admin/borrowers/:id
    getBorrowerById: builder.query<
      { success: boolean; message: string; statusCode: number; data: SingleBorrowerDetailsData },
      string
    >({
      query: (id) => ({
        method: "GET",
        url: `/borrowers/admin/borrowers/${id}`,
      }),
      providesTags: ["Borrowers"],
    }),
  }),
});

export const {
  useGetBorrowerCardsQuery,
  useGetBorrowersQuery,
  useGetBorrowerByIdQuery,
} = borrowerSlice;

export default borrowerSlice;
