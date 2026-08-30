import { useState } from "react";
import {
  LuSearch,
  LuSlidersHorizontal,
  LuCalendar,
  LuClipboardList,
  LuCheckCircle,
  LuBanknote,
  LuBan,
  LuEye,
  LuCheck,
  LuX,
  LuExternalLink,
  LuBuilding,
  LuDollarSign,
  LuCreditCard,
  LuFileText,
  LuAlertTriangle,
} from "react-icons/lu";
import { Modal, Input, InputNumber, Pagination } from "antd";
import toast from "react-hot-toast";
import {
  useGetLoanApplicationsCardsQuery,
  useGetLoanApplicationsQuery,
  useReviewLoanApplicationMutation,
  LoanApplication,
} from "@/redux/apiSlices/loanSlice";
import { imageUrl } from "@/redux/api/baseApi";

const formatCurrency = (val: number | string | undefined): string => {
  if (val === undefined || val === null) return "£0.00";
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return "£0.00";
  return `£${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "APPROVED":
      return (
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-[#E8F8F0] text-[#10B981]">
          Approved
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-[#FEECEC] text-[#EF4444]">
          Rejected
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-[#FEF6E7] text-[#F59E0B]">
          Pending
        </span>
      );
  }
};

const FundingApplications = () => {
  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("30");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Application for Modals
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Approval Form State matching Postman schema:
  // { status: "APPROVED", approvedAmount: 150000, approvedTerms: { durationMonths: 12, interestRate: 8.5, repaymentPercentage: 15 }, reviewNotes: "..." }
  const [approvedAmount, setApprovedAmount] = useState<number>(150000);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [repaymentPercentage, setRepaymentPercentage] = useState<number>(15);
  const [reviewNotes, setReviewNotes] = useState<string>(
    "Loan approved based on revenue consistency."
  );

  // Rejection Form State matching Postman schema:
  // { status: "REJECTED", reviewNotes: "Credit check failed and years in business is less than required." }
  const [rejectReason, setRejectReason] = useState<string>(
    "Credit check failed and years in business is less than required."
  );

  // RTK Query Hooks
  const { data: cardsResponse, isLoading: isCardsLoading } =
    useGetLoanApplicationsCardsQuery();
  const { data: applicationsResponse, isLoading: isAppsLoading } =
    useGetLoanApplicationsQuery({
      page: currentPage,
      limit: pageSize,
      searchTerm: searchTerm.trim() || undefined,
      status: statusFilter !== "All" ? statusFilter : undefined,
    });

  const [reviewApplication, { isLoading: isUpdating }] =
    useReviewLoanApplicationMutation();

  const cardStats = cardsResponse?.data;
  const applications = applicationsResponse?.data || [];
  const meta = applicationsResponse?.meta || {
    page: currentPage,
    limit: pageSize,
    total: applications.length,
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

  // Open Handlers
  const handleOpenDetails = (app: LoanApplication) => {
    setSelectedApp(app);
    setIsDetailsOpen(true);
  };

  const handleOpenApprove = (app: LoanApplication) => {
    setSelectedApp(app);
    setApprovedAmount(app.approvedAmount || 150000 || app.requestedAmount);
    setDurationMonths(app.approvedTerms?.durationMonths || 12);
    setInterestRate(app.approvedTerms?.interestRate || 8.5);
    setRepaymentPercentage(app.approvedTerms?.repaymentPercentage || 15);
    setReviewNotes(
      app.reviewNotes || "Loan approved based on revenue consistency."
    );
    setIsApproveOpen(true);
  };

  const handleOpenReject = (app: LoanApplication) => {
    setSelectedApp(app);
    setRejectReason(
      app.reviewNotes ||
        "Credit check failed and years in business is less than required."
    );
    setIsRejectOpen(true);
  };

  // Submit Approval: PATCH /loans/admin/applications/:id/review
  const handleSubmitApprove = async () => {
    if (!selectedApp) return;
    try {
      await reviewApplication({
        id: selectedApp._id,
        status: "APPROVED",
        approvedAmount: Number(approvedAmount),
        approvedTerms: {
          durationMonths: Number(durationMonths),
          interestRate: Number(interestRate),
          repaymentPercentage: Number(repaymentPercentage),
        },
        reviewNotes: reviewNotes.trim() || "Loan approved based on revenue consistency.",
      }).unwrap();

      toast.success(
        `Application for ${selectedApp.businessDetails?.legalName || "business"} approved successfully!`
      );
      setIsApproveOpen(false);
    } catch (err: any) {
      console.error("Failed to approve application:", err);
      toast.error(
        err?.data?.message || err?.message || "Failed to approve application"
      );
    }
  };

  // Submit Rejection: PATCH /loans/admin/applications/:id/review
  const handleSubmitReject = async () => {
    if (!selectedApp) return;
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason or review notes.");
      return;
    }
    try {
      await reviewApplication({
        id: selectedApp._id,
        status: "REJECTED",
        reviewNotes:
          rejectReason.trim() ||
          "Credit check failed and years in business is less than required.",
      }).unwrap();

      toast.success(
        `Application for ${selectedApp.businessDetails?.legalName || "business"} has been rejected.`
      );
      setIsRejectOpen(false);
    } catch (err: any) {
      console.error("Failed to reject application:", err);
      toast.error(
        err?.data?.message || err?.message || "Failed to reject application"
      );
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Funding Applications
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Review and manage revenue-based financing requests from growing enterprises.
        </p>
      </div>

      {/* 4 Stat Cards Matching Target UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Review Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1B64F2] flex items-center justify-center mb-3">
            <LuClipboardList size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Pending Review</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {isCardsLoading && !cardStats ? (
                <span className="inline-block w-12 h-7 bg-gray-100 animate-pulse rounded" />
              ) : (
                cardStats?.pendingReview ?? 0
              )}
            </h3>
          </div>
        </div>

        {/* Approved Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center mb-3">
            <LuCheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Approved</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {isCardsLoading && !cardStats ? (
                <span className="inline-block w-12 h-7 bg-gray-100 animate-pulse rounded" />
              ) : (
                cardStats?.approved ?? 0
              )}
            </h3>
          </div>
        </div>

        {/* Total Funding Vol. Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-100/50 text-[#92400E] flex items-center justify-center mb-3">
            <LuBanknote size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Total Funding Vol.</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {isCardsLoading && !cardStats ? (
                <span className="inline-block w-16 h-7 bg-gray-100 animate-pulse rounded" />
              ) : (
                formatShortCurrency(cardStats?.totalFundingVolume)
              )}
            </h3>
          </div>
        </div>

        {/* Risk Rejections Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#EF4444] flex items-center justify-center mb-3">
            <LuBan size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Risk Rejections</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {isCardsLoading && !cardStats ? (
                <span className="inline-block w-12 h-7 bg-gray-100 animate-pulse rounded" />
              ) : (
                cardStats?.riskRejections ?? 0
              )}
            </h3>
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
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
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
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-gray-900 font-semibold cursor-pointer focus:outline-none pr-1"
              >
                <option value="30">Last 30 Days</option>
                <option value="60">Last 60 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
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
                <th className="py-3 px-5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isAppsLoading && applications.length === 0 ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-200" />
                        <div className="space-y-1.5">
                          <div className="w-32 h-4 bg-gray-200 rounded" />
                          <div className="w-24 h-3 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
                    <td className="py-3.5 px-5 text-center"><div className="w-16 h-6 bg-gray-100 rounded-full mx-auto" /></td>
                    <td className="py-3.5 px-5 text-center"><div className="w-20 h-7 bg-gray-100 rounded-lg mx-auto" /></td>
                  </tr>
                ))
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400 font-medium">
                    No funding applications match the selected criteria.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const companyName =
                    app.businessDetails?.legalName || "Unknown Company";
                  const sector = app.businessDetails?.industrySector || "Business";
                  const address =
                    app.businessDetails?.registeredAddress || "London, UK";
                  const owner =
                    app.borrowerId?.userId?.name ||
                    app.bankingDetails?.accountHolderName ||
                    "User";
                  const reqAmount = formatCurrency(app.requestedAmount);
                  const revGrowth = formatCurrency(
                    app.financials?.avgMonthlyRevenue
                  );
                  const submitted = app.submittedAt || app.createdAt
                    ? new Date(
                        app.submittedAt || app.createdAt!
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-[#F8FAFC] transition-colors"
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
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                              {sector} • {address}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-5 text-gray-700 font-medium">
                        {owner}
                      </td>

                      {/* Req Amount */}
                      <td className="py-3.5 px-5 text-gray-900 font-medium">
                        {reqAmount}
                      </td>

                      {/* Rev Growth (Avg Monthly Revenue) */}
                      <td className="py-3.5 px-5 text-gray-900 font-medium">
                        {revGrowth}
                      </td>

                      {/* Submitted */}
                      <td className="py-3.5 px-5 text-gray-600">
                        {submitted}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-center">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(app)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                            title="View Application Details"
                          >
                            <LuEye size={17} />
                          </button>

                          {/* Only show Approve and Reject buttons if NOT Approved and NOT Rejected */}
                          {(app.status || "").toUpperCase() !== "APPROVED" &&
                            (app.status || "").toUpperCase() !== "REJECTED" && (
                              <>
                                {/* Approve Action */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenApprove(app)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                                  title="Approve Funding"
                                >
                                  <LuCheck size={17} />
                                </button>

                                {/* Reject Action */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenReject(app)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                                  title="Reject Application"
                                >
                                  <LuX size={17} />
                                </button>
                              </>
                            )}
                        </div>
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
              {applications.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
              {Math.min(currentPage * pageSize, meta.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{meta.total}</span>{" "}
            applications
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

      {/* ========================================================================= */}
      {/* 1. VIEW APPLICATION DETAILS MODAL                                         */}
      {/* ========================================================================= */}
      <Modal
        open={isDetailsOpen}
        onCancel={() => setIsDetailsOpen(false)}
        footer={null}
        width={760}
        centered
        title={
          <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1B64F2] flex items-center justify-center font-bold text-sm">
              {selectedApp
                ? getInitials(selectedApp.businessDetails?.legalName || "")
                : "AP"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {selectedApp?.businessDetails?.legalName || "Application Details"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                ID: {selectedApp?._id} • Sector:{" "}
                {selectedApp?.businessDetails?.industrySector}
              </p>
            </div>
          </div>
        }
      >
        {selectedApp && (
          <div className="space-y-6 pt-3 text-sm max-h-[75vh] overflow-y-auto pr-1">
            {/* Status & Highlights */}
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">Status</p>
                <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">Requested</p>
                <p className="font-bold text-gray-900 mt-1">
                  {formatCurrency(selectedApp.requestedAmount)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">Approved Amount</p>
                <p className="font-bold text-[#10B981] mt-1">
                  {formatCurrency(selectedApp.approvedAmount || 0)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">Monthly Revenue</p>
                <p className="font-bold text-gray-900 mt-1">
                  {formatCurrency(selectedApp.financials?.avgMonthlyRevenue)}
                </p>
              </div>
            </div>

            {/* Business Details */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <LuBuilding className="text-[#1B64F2]" /> Business Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-gray-50/60 p-3.5 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400">Legal Name:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.businessDetails?.legalName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Company Reg No (CRN):</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.businessDetails?.crn}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Store / Website:</span>{" "}
                  {selectedApp.businessDetails?.storeUrl ? (
                    <a
                      href={selectedApp.businessDetails.storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1B64F2] hover:underline inline-flex items-center gap-1"
                    >
                      {selectedApp.businessDetails.storeUrl} <LuExternalLink size={12} />
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <span className="text-gray-400">Years in Business:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.businessDetails?.yearsInBusiness} years
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-400">Registered Address:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.businessDetails?.registeredAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <LuDollarSign className="text-emerald-500" /> Financials & Performance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-gray-50/60 p-3.5 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400">Annual Turnover:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {formatCurrency(selectedApp.financials?.annualTurnover)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Primary Channel:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.financials?.primarySalesChannel || "Shopify"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Monthly Sales Volume:</span>{" "}
                  <span className="font-medium text-gray-800">
                    £{(selectedApp.financials?.monthlySalesVolume || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Loan Purpose:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.financials?.purpose || "Expansion"}
                  </span>
                </div>
              </div>
            </div>

            {/* Banking Details */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <LuCreditCard className="text-indigo-500" /> Banking Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-gray-50/60 p-3.5 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400">Bank Name:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.bankingDetails?.bankName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Account Holder:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.bankingDetails?.accountHolderName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Sort Code:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.bankingDetails?.sortCode}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Account Number:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.bankingDetails?.accountNumber}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-400">IBAN:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedApp.bankingDetails?.iban || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            {selectedApp.documents && (
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <LuFileText className="text-amber-500" /> Uploaded Documents
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedApp.documents.certificateOfIncorporation && (
                    <a
                      href={`${imageUrl}${selectedApp.documents.certificateOfIncorporation}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1B64F2] font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
                    >
                      <LuFileText size={14} /> Certificate of Inc.
                    </a>
                  )}
                  {selectedApp.documents.ownersPhotoId && (
                    <a
                      href={`${imageUrl}${selectedApp.documents.ownersPhotoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1B64F2] font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
                    >
                      <LuFileText size={14} /> Owner Photo ID
                    </a>
                  )}
                  {selectedApp.documents.bankStatements?.map((doc, idx) => (
                    <a
                      key={idx}
                      href={`${imageUrl}${doc}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1B64F2] font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
                    >
                      <LuFileText size={14} /> Bank Statement {idx + 1}
                    </a>
                  ))}
                  {selectedApp.documents.vatReturns?.map((doc, idx) => (
                    <a
                      key={idx}
                      href={`${imageUrl}${doc}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1B64F2] font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
                    >
                      <LuFileText size={14} /> VAT Return {idx + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Terms (if present) */}
            {selectedApp.approvedTerms && (
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-xs">
                <p className="font-bold text-emerald-800 mb-1.5">Approved Financing Terms:</p>
                <div className="grid grid-cols-3 gap-2 text-emerald-950 font-medium">
                  <div>Duration: {selectedApp.approvedTerms.durationMonths} Months</div>
                  <div>Interest Rate: {selectedApp.approvedTerms.interestRate}%</div>
                  <div>Repayment: {selectedApp.approvedTerms.repaymentPercentage}% of revenue</div>
                </div>
              </div>
            )}

            {/* Review Notes */}
            {selectedApp.reviewNotes && (
              <div className="text-xs bg-gray-100/70 p-3 rounded-xl">
                <span className="font-bold text-gray-700">Review Notes: </span>
                <span className="text-gray-600">{selectedApp.reviewNotes}</span>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              {(selectedApp.status || "").toUpperCase() !== "APPROVED" &&
              (selectedApp.status || "").toUpperCase() !== "REJECTED" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleOpenReject(selectedApp);
                    }}
                    className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 cursor-pointer transition-colors"
                  >
                    Reject Application
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDetailsOpen(false)}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        handleOpenApprove(selectedApp);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#1B64F2] text-white text-xs font-semibold hover:bg-[#1451C9] cursor-pointer shadow-xs transition-colors"
                    >
                      Approve Financing
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs text-gray-500 italic">
                    This application has already been {(selectedApp.status || "").toLowerCase()}.
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(false)}
                    className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 2. APPROVE APPLICATION POPUP MODAL                                        */}
      {/* ========================================================================= */}
      <Modal
        open={isApproveOpen}
        onCancel={() => setIsApproveOpen(false)}
        footer={null}
        width={620}
        centered
        title={
          <div className="flex items-center gap-2 text-emerald-700 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <LuCheckCircle size={18} />
            </div>
            <div>
              <span className="font-bold text-base text-gray-900 block leading-tight">
                Approve Funding Application
              </span>
              <span className="text-xs text-gray-400 font-normal">
                {selectedApp?.businessDetails?.legalName} (CRN: {selectedApp?.businessDetails?.crn})
              </span>
            </div>
          </div>
        }
      >
        <div className="space-y-4 pt-3 text-xs">
          {/* Business & Financial Quick Overview Card */}
          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-200/70 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <p className="text-[10px] uppercase font-semibold text-gray-400">Requested</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">
                {formatCurrency(selectedApp?.requestedAmount)}
              </p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <p className="text-[10px] uppercase font-semibold text-gray-400">Avg Monthly Rev.</p>
              <p className="text-sm font-bold text-[#1B64F2] mt-0.5">
                {formatCurrency(selectedApp?.financials?.avgMonthlyRevenue)}
              </p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <p className="text-[10px] uppercase font-semibold text-gray-400">Annual Turnover</p>
              <p className="text-sm font-bold text-emerald-600 mt-0.5">
                {formatCurrency(selectedApp?.financials?.annualTurnover)}
              </p>
            </div>
          </div>

          {/* Form Inputs configured to match Postman Body */}
          <div className="space-y-3">
            {/* Approved Amount */}
            <div>
              <label className="block font-semibold text-gray-800 mb-1">
                Approved Amount (£) <span className="text-red-500">*</span>
              </label>
              <InputNumber
                className="w-full h-10 rounded-xl flex items-center text-sm"
                min={1000}
                value={approvedAmount}
                onChange={(val) => setApprovedAmount(val || 0)}
                formatter={(value) => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => Number(value?.replace(/£\s?|(,*)/g, "") || 0)}
              />
            </div>

            {/* Approved Terms (3 columns) */}
            <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100 space-y-2">
              <p className="font-bold text-gray-700 text-[11px] uppercase tracking-wider">
                Approved Financing Terms
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-medium text-gray-600 mb-1">
                    Duration (Months)
                  </label>
                  <InputNumber
                    className="w-full h-9 rounded-lg"
                    min={1}
                    max={60}
                    value={durationMonths}
                    onChange={(val) => setDurationMonths(val || 12)}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-600 mb-1">
                    Interest Rate (%)
                  </label>
                  <InputNumber
                    className="w-full h-9 rounded-lg"
                    step={0.1}
                    min={0}
                    max={100}
                    value={interestRate}
                    onChange={(val) => setInterestRate(val || 0)}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-600 mb-1">
                    Revenue Share (%)
                  </label>
                  <InputNumber
                    className="w-full h-9 rounded-lg"
                    step={1}
                    min={1}
                    max={100}
                    value={repaymentPercentage}
                    onChange={(val) => setRepaymentPercentage(val || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Review Notes */}
            <div>
              <label className="block font-semibold text-gray-800 mb-1">
                Review Notes <span className="text-gray-400 font-normal">(Visible in audit & borrower notice)</span>
              </label>
              <Input.TextArea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Loan approved based on revenue consistency."
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {/* Quick Switch to Reject */}
            <button
              type="button"
              onClick={() => {
                setIsApproveOpen(false);
                handleOpenReject(selectedApp!);
              }}
              className="text-rose-600 hover:text-rose-700 hover:underline text-xs font-semibold cursor-pointer"
            >
              Reject Instead
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsApproveOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSubmitApprove}
                className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold cursor-pointer shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
              >
                {isUpdating ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LuCheck size={16} /> Approve Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. REJECT APPLICATION POPUP MODAL                                         */}
      {/* ========================================================================= */}
      <Modal
        open={isRejectOpen}
        onCancel={() => setIsRejectOpen(false)}
        footer={null}
        width={540}
        centered
        title={
          <div className="flex items-center gap-2 text-rose-600 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <LuBan size={18} />
            </div>
            <div>
              <span className="font-bold text-base text-gray-900 block leading-tight">
                Reject Funding Application
              </span>
              <span className="text-xs text-gray-400 font-normal">
                {selectedApp?.businessDetails?.legalName} (Requested: {formatCurrency(selectedApp?.requestedAmount)})
              </span>
            </div>
          </div>
        }
      >
        <div className="space-y-4 pt-3 text-xs">
          {/* Warning Message Box */}
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2.5 text-rose-800">
            <LuAlertTriangle className="text-rose-500 flex-shrink-0 mt-0.5" size={17} />
            <p className="leading-relaxed">
              Are you sure you want to decline this financing request? The status will be set to <span className="font-bold">REJECTED</span> and the reason will be recorded.
            </p>
          </div>

          {/* Rejection Notes matching Postman body */}
          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Rejection Reason / Notes <span className="text-red-500">*</span>
            </label>
            <Input.TextArea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Credit check failed and years in business is less than required."
              className="rounded-xl text-xs"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {/* Quick Switch to Approve */}
            <button
              type="button"
              onClick={() => {
                setIsRejectOpen(false);
                handleOpenApprove(selectedApp!);
              }}
              className="text-emerald-600 hover:text-emerald-700 hover:underline text-xs font-semibold cursor-pointer"
            >
              Approve Instead
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSubmitReject}
                className="px-5 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold cursor-pointer shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
              >
                {isUpdating ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LuX size={16} /> Confirm Rejection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FundingApplications;
