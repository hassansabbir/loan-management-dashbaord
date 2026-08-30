import { api } from "../api/baseApi";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  description?: string;
  receiver?: string;
  type?: "APPLICATION" | "PAYOUT" | "REPAYMENT" | "BORROWER" | "SYSTEM" | string;
  screen?: string;
  referenceModel?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  statusCode?: number;
  data: {
    result?: NotificationItem[];
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  } | NotificationItem[];
}

export const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /notifications -> directly returns NotificationItem[]
    getNotifications: builder.query<NotificationItem[], void>({
      query: () => ({
        url: `/notifications`,
        method: "GET",
      }),
      transformResponse: (response: any): NotificationItem[] => {
        if (Array.isArray(response?.data?.result)) {
          return response.data.result;
        }
        if (Array.isArray(response?.data)) {
          return response.data;
        }
        if (Array.isArray(response?.result)) {
          return response.result;
        }
        return [];
      },
      providesTags: ["Notifications"],
    }),

    markAsRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllAsRead: builder.mutation<any, void>({
      query: () => ({
        url: `/notifications/mark-all-read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationSlice;

export default notificationSlice;
