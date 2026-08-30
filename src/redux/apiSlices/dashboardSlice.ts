import { api } from "../api/baseApi";

export interface OverviewStats {
  totalBorrowers: number;
  pendingApplications: number;
  activeLoans: number;
  totalLoanAmount: number;
}

export interface ChartDataPoint {
  month: string;
  funding: number;
  repayments: number;
}

export interface RecentApplicationItem {
  _id: string;
  companyName: string;
  companyAddress: string;
  owner: string;
  image?: string;
  requestedAmount: number;
  avgMonthlyRevenue: number;
  submittedAt: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

const dashboardSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Overview Cards: GET /dashboard/admin/overview-cards
    getDashboardOverviewCards: builder.query<ApiResponse<OverviewStats>, void>({
      query: () => ({
        method: "GET",
        url: "/dashboard/admin/overview-cards",
      }),
      providesTags: ["DashboardOverview"],
    }),

    // 2. Funding vs Repayments Chart: GET /dashboard/admin/chart
    getAdminFundingChart: builder.query<ApiResponse<ChartDataPoint[]>, void>({
      query: () => ({
        method: "GET",
        url: "/dashboard/admin/chart",
      }),
      providesTags: ["DashboardOverview"],
    }),

    // 3. Recent Applications: GET /dashboard/admin/recent-applications
    getAdminRecentApplications: builder.query<ApiResponse<RecentApplicationItem[]>, void>({
      query: () => ({
        method: "GET",
        url: "/dashboard/admin/recent-applications",
      }),
      providesTags: ["Applications", "DashboardOverview"],
    }),

    // Aliases for compatibility
    getDashboardOverview: builder.query<ApiResponse<OverviewStats>, void>({
      query: () => ({
        method: "GET",
        url: "/dashboard/admin/overview-cards",
      }),
      providesTags: ["DashboardOverview"],
    }),

    getFundingRepaymentsChart: builder.query<ApiResponse<ChartDataPoint[]>, void>({
      query: () => ({
        method: "GET",
        url: "/dashboard/admin/chart",
      }),
      providesTags: ["DashboardOverview"],
    }),

    getRecentApplications: builder.query<ApiResponse<RecentApplicationItem[]>, void>({
      query: () => ({
        method: "GET",
        url: "/dashboard/admin/recent-applications",
      }),
      providesTags: ["Applications"],
    }),
  }),
});

export const {
  useGetDashboardOverviewCardsQuery,
  useGetAdminFundingChartQuery,
  useGetAdminRecentApplicationsQuery,
  useGetDashboardOverviewQuery,
  useGetFundingRepaymentsChartQuery,
  useGetRecentApplicationsQuery,
} = dashboardSlice;

export default dashboardSlice;
