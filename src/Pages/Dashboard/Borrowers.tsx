import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuSearch,
  LuSlidersHorizontal,
  LuCalendar,
  LuUsers,
  LuActivity,
  LuWallet,
  LuEye,
} from "react-icons/lu";
import { Pagination } from "antd";
import {
  useGetBorrowerCardsQuery,
  useGetBorrowersQuery,
} from "@/redux/apiSlices/borrowerSlice";

const formatCurrency = (val: number | string | undefined): string => {
  if (val === undefined || val === null) return "£0";
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return "£0";
  return `£${num.toLocaleString("en-US")}`;
};

const formatShortCurrency = (val: number | undefined): string => {
  if (val === undefined || val === null) return "£0";
  if (val >= 1_000_000) {
    return `£${(val / 1_000_000).toFixed(1)}M`;
  }
  if (val >= 1_000) {
    return `£${(val / 1_000).toFixed(0)}K`;
  }
  return `£${val.toLocaleString()}`;
};

const getStatusBadge = (status: string) => {
  const normalized = (status || "").toLowerCase();
  switch (normalized) {
    case "active":
      return (
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-[#E8F8F0] text-[#10B981]">
          Active
        </span>
      );
    case "inactive":
    case "suspended":
      return (
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-[#FEECEC] text-[#EF4444]">
          {status}
        </span>
      );
    case "pending review":
    default:
      return (
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-[#FEF6E7] text-[#F59E0B]">
          {status || "Active"}
        </span>
      );
  }
};

const Borrowers = () => {
  const navigate = useNavigate();

  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("last30days");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // RTK Query Hooks
  const { data: cardsResponse, isLoading: isCardsLoading } = useGetBorrowerCardsQuery();

  // If status is "All", do NOT send status to API
  const { data: borrowersResponse, isLoading: isBorrowersLoading } = useGetBorrowersQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: searchTerm.trim() || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    dateRange: dateFilter !== "all" ? dateFilter : undefined,
  });

  const cardStats = cardsResponse?.data;
  const borrowers = borrowersResponse?.data || [];
  const meta = borrowersResponse?.meta || {
    page: currentPage,
    limit: pageSize,
    total: borrowers.length,
    totalPage: 1,
  };

  const getInitials = (name: string): string => {
    if (!name) return "SF";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Borrower Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Monitor and manage your active RBF portfolio performance.
        </p>
      </div>

      {/* 3 Stat Cards Matching Reference Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Borrowers Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1B64F2] flex items-center justify-center mb-3">
              <LuUsers size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-500">Active Borrowers</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {isCardsLoading && !cardStats ? (
                <span className="inline-block w-12 h-7 bg-gray-100 animate-pulse rounded" />
              ) : (
                (cardStats?.activeBorrowers ?? 0).toLocaleString()
              )}
            </h3>
          </div>
          {/* Subtle Progress Bar */}
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-4">
            <div className="bg-[#1B64F2] h-full rounded-full w-[45%]" />
          </div>
        </div>

        {/* Avg. Repayment Rate Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center mb-3">
              <LuActivity size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-500">Avg. Repayment Rate</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {isCardsLoading && !cardStats ? (
                <span className="inline-block w-16 h-7 bg-gray-100 animate-pulse rounded" />
              ) : (
                `${cardStats?.avgRepaymentRate ?? 0}%`
              )}
            </h3>
          </div>
          {/* Subtle Progress Bar */}
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-4">
            <div
              className="bg-[#10B981] h-full rounded-full"
              style={{ width: `${Math.min(cardStats?.avgRepaymentRate || 80, 100)}%` }}
            />
          </div>
        </div>

        {/* Total Portfolio Value Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100/50 text-[#92400E] flex items-center justify-center mb-3">
              <LuWallet size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-500">Total Portfolio Value</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {isCardsLoading && !cardStats ? (
                <span className="inline-block w-16 h-7 bg-gray-100 animate-pulse rounded" />
              ) : (
                cardStats?.totalPortfolioValue
                  ? formatShortCurrency(cardStats.totalPortfolioValue)
                  : "£0"
              )}
            </h3>
          </div>
          {/* Subtle Progress Bar */}
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-4">
            <div className="bg-[#92400E] h-full rounded-full w-[55%]" />
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-gray-200/80 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative flex-1 md:flex-initial">
            <div className="h-10 px-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-gray-700 shadow-2xs cursor-pointer hover:border-gray-300">
              <LuSlidersHorizontal size={15} className="text-gray-500" />
              <span className="text-gray-500 font-normal">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-gray-900 font-semibold cursor-pointer focus:outline-none pr-1"
              >
                <option value="All">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending review">Pending Review</option>
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="relative flex-1 md:flex-initial">
            <div className="h-10 px-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-gray-700 shadow-2xs cursor-pointer hover:border-gray-300">
              <LuCalendar size={15} className="text-gray-500" />
              <span className="text-gray-500 font-normal">Date:</span>
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-gray-900 font-semibold cursor-pointer focus:outline-none pr-1"
              >
                <option value="last30days">Last 30 Days</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="thisyear">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Borrowers Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFBFD] text-[13px] font-semibold text-gray-600">
                <th className="py-3 px-5 font-semibold">Company Name</th>
                <th className="py-3 px-5 font-semibold">Industry</th>
                <th className="py-3 px-5 font-semibold">Total Funding</th>
                <th className="py-3 px-5 font-semibold">Outstanding</th>
                <th className="py-3 px-5 font-semibold">Repayment %</th>
                <th className="py-3 px-5 font-semibold text-center">Status</th>
                <th className="py-3 px-5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isBorrowersLoading && borrowers.length === 0 ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-200" />
                        <div className="space-y-1.5">
                          <div className="w-32 h-4 bg-gray-200 rounded" />
                          <div className="w-20 h-3 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5"><div className="w-28 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5 text-center"><div className="w-16 h-6 bg-gray-100 rounded-full mx-auto" /></td>
                    <td className="py-3.5 px-5 text-center"><div className="w-7 h-7 bg-gray-100 rounded-lg mx-auto" /></td>
                  </tr>
                ))
              ) : borrowers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400 font-medium">
                    No registered borrowers found.
                  </td>
                </tr>
              ) : (
                borrowers.map((item) => {
                  const companyName = item.businessDetails?.legalName || "Unknown Borrower";
                  const industry = item.businessDetails?.industrySector || "Retail";
                  const borrowerId = `RBF-${item._id.slice(-4).toUpperCase()}`;

                  const totalFunding = formatCurrency(item.loanDetails?.totalFunding);
                  const outstanding = formatCurrency(item.loanDetails?.outstanding);

                  const progress = item.loanDetails?.repaymentProgress ?? 0;
                  const repaymentRate = item.loanDetails?.repaymentPercentage ?? progress;

                  // Progress bar color matching target design
                  let progressColor = "bg-[#1B64F2]";
                  let textColor = "text-[#1B64F2]";
                  let dotColor = "bg-[#1B64F2]";

                  if (repaymentRate < 25) {
                    progressColor = "bg-rose-500";
                    textColor = "text-rose-600";
                    dotColor = "bg-rose-500";
                  } else if (repaymentRate >= 75) {
                    progressColor = "bg-emerald-500";
                    textColor = "text-emerald-600";
                    dotColor = "bg-emerald-500";
                  }

                  return (
                    <tr
                      key={item._id}
                      onClick={() => navigate(`/borrowers/${item._id}`)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      {/* Company Name */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-[#1B64F2] flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {getInitials(companyName)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">
                              {companyName}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              ID: {borrowerId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="py-3.5 px-5 text-gray-700 font-medium">
                        {industry}
                      </td>

                      {/* Total Funding */}
                      <td className="py-3.5 px-5 text-gray-900 font-medium">
                        {totalFunding}
                      </td>

                      {/* Outstanding */}
                      <td className="py-3.5 px-5 text-gray-900 font-medium">
                        {outstanding}
                      </td>

                      {/* Repayment % with Progress Bar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3 max-w-[150px]">
                          {/* Dot indicator */}
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0`} />
                          {/* Progress track */}
                          <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${progressColor}`}
                              style={{ width: `${Math.min(Math.max(repaymentRate, 5), 100)}%` }}
                            />
                          </div>
                          {/* Percentage text */}
                          <span className={`text-xs font-semibold ${textColor} w-9 text-right`}>
                            {repaymentRate}%
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-center">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/borrowers/${item._id}`);
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer mx-auto"
                          title="View Borrower Details"
                        >
                          <LuEye size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {borrowers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
              {Math.min(currentPage * pageSize, meta.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{meta.total}</span>{" "}
            borrowers
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={meta.total}
            onChange={(p) => setCurrentPage(p)}
            showSizeChanger={false}
            className="clean-pagination"
          />
        </div>
      </div>
    </div>
  );
};

export default Borrowers;
