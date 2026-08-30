import { Link } from "react-router-dom";
import { useGetAdminRecentApplicationsQuery } from "@/redux/apiSlices/dashboardSlice";

const getStatusBadge = (status: string) => {
  const normalized = (status || "").toLowerCase();
  switch (normalized) {
    case "approved":
      return (
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-[#E8F8F0] text-[#10B981]">
          Approved
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-[#FEECEC] text-[#EF4444]">
          Rejected
        </span>
      );
    case "pending":
    default:
      return (
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-[#FEF6E7] text-[#F59E0B]">
          Pending
        </span>
      );
  }
};

const RecentApplicationsTable = () => {
  const { data: apiResponse, isLoading } = useGetAdminRecentApplicationsQuery();

  const getInitials = (name: string) => {
    if (!name) return "SF";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const applications = (apiResponse?.data || []).map((item) => ({
    id: item._id,
    initials: getInitials(item.companyName),
    companyName: item.companyName || "Unknown Business",
    companyAddress: item.companyAddress || "London, UK",
    owner: item.owner || "User",
    image: item.image,
    reqAmount:
      item.requestedAmount !== undefined
        ? `£${item.requestedAmount.toLocaleString()}`
        : "£0",
    revGrowth:
      item.avgMonthlyRevenue !== undefined
        ? `£${item.avgMonthlyRevenue.toLocaleString()}`
        : "£0",
    submitted: item.submittedAt
      ? new Date(item.submittedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
    status: item.status || "PENDING",
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Table Card Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Recent Applications</h3>
        <Link
          to="/funding-applications"
          className="text-xs font-semibold text-[#1B64F2] hover:text-[#1451C9] transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-[#FAFBFD] text-[13px] font-semibold text-gray-600">
              <th className="py-3 px-5 font-semibold">Company Name</th>
              <th className="py-3 px-5 font-semibold">Owner</th>
              <th className="py-3 px-5 font-semibold">Req. Amount</th>
              <th className="py-3 px-5 font-semibold">Rev. Growth</th>
              <th className="py-3 px-5 font-semibold">Submitted</th>
              <th className="py-3 px-5 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading && applications.length === 0 ? (
              [...Array(2)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-200" />
                      <div className="space-y-1.5">
                        <div className="w-32 h-4 bg-gray-200 rounded" />
                        <div className="w-24 h-3 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
                  <td className="py-3 px-5"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
                  <td className="py-3 px-5"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
                  <td className="py-3 px-5"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
                  <td className="py-3 px-5 text-center"><div className="w-16 h-6 bg-gray-100 rounded-full mx-auto" /></td>
                </tr>
              ))
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-gray-400 font-medium">
                  No applications submitted yet.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  {/* Company Name */}
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-[#1B64F2] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {app.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">
                          {app.companyName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                          {app.companyAddress}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="py-3 px-5 text-gray-700 font-medium">
                    {app.owner}
                  </td>

                  {/* Req Amount */}
                  <td className="py-3 px-5 text-gray-900 font-medium">
                    {app.reqAmount}
                  </td>

                  {/* Rev Growth (Avg Monthly Revenue) */}
                  <td className="py-3 px-5 text-gray-900 font-medium">
                    {app.revGrowth}
                  </td>

                  {/* Submitted */}
                  <td className="py-3 px-5 text-gray-600">
                    {app.submitted}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-5 text-center">
                    {getStatusBadge(app.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplicationsTable;
