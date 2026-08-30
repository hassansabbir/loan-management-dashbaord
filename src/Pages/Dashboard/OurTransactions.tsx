import { useState } from "react";
import {
  LuSearch,
  LuSlidersHorizontal,
  LuBuilding,
  LuCalendar,
} from "react-icons/lu";
import { Modal, Pagination } from "antd";
import {
  useGetTransactionsQuery,
  TransactionItem,
} from "@/redux/apiSlices/transactionSlice";

const formatCurrency = (val: number | string | undefined): string => {
  if (val === undefined || val === null) return "£0.00";
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return "£0.00";
  return `£${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDateTime = (isoString?: string) => {
  if (!isoString) return { date: "—", time: "—" };
  const d = new Date(isoString);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const seconds = String(d.getUTCSeconds()).padStart(2, "0");
  const time = `${hours}:${minutes}:${seconds} UTC`;
  return { date, time };
};

const getStatusBadge = (status: string) => {
  const normalized = (status || "").toLowerCase();
  switch (normalized) {
    case "succeeded":
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E8F8F0] text-[#10B981]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          Succeeded
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FEECEC] text-[#EF4444]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          Failed
        </span>
      );
    case "pending":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FEF6E7] text-[#F59E0B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          Pending
        </span>
      );
  }
};

const OurTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Selected Transaction for Details Modal
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Query Hook
  const { data: apiResponse, isLoading } = useGetTransactionsQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: searchTerm.trim() || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
  });

  const transactions = apiResponse?.data || [];
  const meta = apiResponse?.meta || {
    page: currentPage,
    limit: pageSize,
    total: transactions.length,
    totalPage: 1,
  };

  const getInitials = (name: string): string => {
    if (!name) return "TX";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleOpenDetails = (tx: TransactionItem) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Transactions History
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Real-time financial ledger of all platform-wide movements.
        </p>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-2xl flex-1">
          <LuSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={17}
          />
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

        {/* Status Filter */}
        <div className="relative w-full sm:w-auto">
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
              <option value="Succeeded">Succeeded</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFBFD] text-[13px] font-semibold text-gray-600">
                <th className="py-3 px-5 font-semibold">Date & Time</th>
                <th className="py-3 px-5 font-semibold">Transaction ID</th>
                <th className="py-3 px-5 font-semibold">Business</th>
                <th className="py-3 px-5 font-semibold">Gross Amount</th>
                <th className="py-3 px-5 font-semibold">Repayment %</th>
                <th className="py-3 px-5 font-semibold">Net Payout</th>
                <th className="py-3 px-5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading && transactions.length === 0 ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-5">
                      <div className="space-y-1">
                        <div className="w-24 h-4 bg-gray-200 rounded" />
                        <div className="w-16 h-3 bg-gray-100 rounded" />
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="w-28 h-4 bg-gray-200 rounded" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-200" />
                        <div className="space-y-1">
                          <div className="w-24 h-4 bg-gray-200 rounded" />
                          <div className="w-16 h-3 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5"><div className="w-16 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5 text-center"><div className="w-20 h-6 bg-gray-100 rounded-full mx-auto" /></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400 font-medium">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const { date, time } = formatDateTime(tx.createdAt);
                  const businessName = tx.business?.name || "Business";
                  const businessAddress = tx.business?.address || "London, UK";

                  // Parse business words for design style (e.g. "Velvet" on top, "Pulse" on bottom)
                  const nameParts = businessName.trim().split(/\s+/);
                  const firstPart = nameParts[0] || businessName;
                  const secondPart = nameParts.slice(1).join(" ") || businessAddress;

                  const grossFormatted = formatCurrency(tx.grossAmount);
                  const repaymentFormatted = `-${formatCurrency(tx.repayment)}`;
                  const netPayoutFormatted = formatCurrency(tx.netPayout);

                  return (
                    <tr
                      key={tx._id}
                      onClick={() => handleOpenDetails(tx)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      {/* Date & Time */}
                      <td className="py-3.5 px-5">
                        <p className="text-xs font-semibold text-gray-900 leading-tight">
                          {date}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                          {time}
                        </p>
                      </td>

                      {/* Transaction ID */}
                      <td className="py-3.5 px-5">
                        <span className="text-xs font-medium text-[#1B64F2] hover:underline font-mono">
                          {tx.transactionId}
                        </span>
                      </td>

                      {/* Business */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          {tx.business?.logo ? (
                            <img
                              src={tx.business.logo}
                              alt={businessName}
                              className="w-9 h-9 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-[#1B64F2] flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {getInitials(businessName)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">
                              {firstPart}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                              {secondPart}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Gross Amount */}
                      <td className="py-3.5 px-5 text-gray-900 font-semibold text-sm">
                        {grossFormatted}
                      </td>

                      {/* Repayment % (Deduction) */}
                      <td className="py-3.5 px-5 text-rose-500 font-medium text-sm">
                        {repaymentFormatted}
                      </td>

                      {/* Net Payout */}
                      <td className="py-3.5 px-5 text-gray-900 font-medium text-sm">
                        {netPayoutFormatted}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-center">
                        {getStatusBadge(tx.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Results per page and Pagination */}
        <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          {/* Results per page selector */}
          <div className="flex items-center gap-2">
            <span>Results per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Pagination Controls */}
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

      {/* ========================================================================= */}
      {/* TRANSACTION DETAILS MODAL                                                 */}
      {/* ========================================================================= */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={580}
        centered
        title={
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1B64F2] flex items-center justify-center font-bold text-sm">
              {selectedTx ? getInitials(selectedTx.business?.name || "") : "TX"}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                Transaction Details
              </h2>
              <p className="text-xs text-[#1B64F2] font-mono mt-0.5">
                {selectedTx?.transactionId}
              </p>
            </div>
          </div>
        }
      >
        {selectedTx && (
          <div className="space-y-4 pt-3 text-xs">
            {/* Status & Type Bar */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase block">
                  Status
                </span>
                <div className="mt-1">{getStatusBadge(selectedTx.status)}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-gray-400 uppercase block">
                  Payment Type
                </span>
                <span className="font-bold text-gray-800 text-xs px-2.5 py-0.5 bg-white border border-gray-200 rounded-lg inline-block mt-1">
                  {selectedTx.type || "SALE"}
                </span>
              </div>
            </div>

            {/* Financial Breakdown Card */}
            <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-2">
              <p className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
                Financial Breakdown
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Gross Transaction Amount:</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(selectedTx.grossAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-rose-500">
                  <span>Repayment Deduction:</span>
                  <span className="font-bold">
                    -{formatCurrency(selectedTx.repayment)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-gray-900 text-sm font-bold">
                  <span>Net Payout to Merchant:</span>
                  <span className="text-[#10B981]">
                    {formatCurrency(selectedTx.netPayout)}
                  </span>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div>
              <p className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <LuBuilding className="text-[#1B64F2]" /> Business Information
              </p>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <p className="font-semibold text-gray-900 text-xs">
                  {selectedTx.business?.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {selectedTx.business?.address}
                </p>
              </div>
            </div>

            {/* Timestamp Info */}
            <div className="text-gray-400 text-[11px] flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <LuCalendar size={13} /> Recorded:{" "}
                {new Date(selectedTx.createdAt).toUTCString()}
              </span>
              <span className="font-mono">DB ID: {selectedTx._id}</span>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OurTransactions;
