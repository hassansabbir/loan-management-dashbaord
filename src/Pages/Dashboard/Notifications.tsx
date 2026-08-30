import { LuBell } from "react-icons/lu";
import {
  useGetNotificationsQuery,
  NotificationItem,
} from "@/redux/apiSlices/notificationSlice";

const defaultNotifications: NotificationItem[] = [
  {
    _id: "1",
    title: "Application Received",
    message: "Your loan application for Fintech Ltd has been submitted successfully.",
    createdAt: "2026-08-30T06:35:19.353Z",
    read: false,
  },
  {
    _id: "2",
    title: "Payout Transferred",
    message: "Disbursement of £250,000 has been transferred to your connected Barclays account.",
    createdAt: "2026-08-30T04:35:19.353Z",
    read: false,
  },
  {
    _id: "3",
    title: "Repayment Received",
    message: "A revenue share repayment of £842.10 has been automatically processed.",
    createdAt: "2026-08-29T14:20:00.000Z",
    read: true,
  },
];

const formatNotificationDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const Notifications = () => {
  const { data: apiNotifications, isLoading } = useGetNotificationsQuery();

  const notifications =
    apiNotifications && apiNotifications.length > 0
      ? apiNotifications
      : defaultNotifications;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          See all system notifications
        </p>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="space-y-1.5">
                  <div className="w-44 h-4 bg-gray-200 rounded" />
                  <div className="w-72 h-3 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="w-20 h-3 bg-gray-100 rounded" />
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">
            No notifications yet.
          </div>
        ) : (
          notifications.map((item) => {
            const isUnread = item.read === false;

            return (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0 pr-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1B64F2] flex items-center justify-center flex-shrink-0 relative">
                    <LuBell size={18} />
                    {isUnread && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1B64F2]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {item.title}
                      </h3>
                      {isUnread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1B64F2] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {item.message || item.description}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-gray-400 flex-shrink-0 font-medium whitespace-nowrap">
                  {formatNotificationDate(item.createdAt)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
