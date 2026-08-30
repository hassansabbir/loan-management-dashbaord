import React from "react";
import { LuUser, LuFileEdit, LuBriefcase, LuWallet } from "react-icons/lu";
import { useGetDashboardOverviewCardsQuery } from "@/redux/apiSlices/dashboardSlice";

interface StatItem {
  label: string;
  count: string | number;
  icon: React.ReactNode;
  textColor: string;
  iconBg: string;
  iconColor: string;
}

const GeneralStateSection = () => {
  const { data: overviewResponse, isLoading } = useGetDashboardOverviewCardsQuery();
  const statsData = overviewResponse?.data;

  const formatNumber = (val: number | string | undefined, isCurrency: boolean = false) => {
    if (val === undefined || val === null) return "0";
    if (typeof val === "number") {
      return isCurrency ? `£${val.toLocaleString("en-US")}` : val.toLocaleString("en-US");
    }
    return val;
  };

  const stats: StatItem[] = [
    {
      label: "TOTAL BORROWERS",
      count: formatNumber(statsData?.totalBorrowers),
      icon: <LuUser size={24} />,
      textColor: "text-[#1B64F2]",
      iconBg: "bg-blue-50 text-[#1B64F2]",
      iconColor: "text-[#1B64F2]",
    },
    {
      label: "PENDING APPLICATION",
      count: formatNumber(statsData?.pendingApplications),
      icon: <LuFileEdit size={24} />,
      textColor: "text-[#F59E0B]",
      iconBg: "bg-amber-50 text-[#F59E0B]",
      iconColor: "text-[#F59E0B]",
    },
    {
      label: "ACTIVE LOANS",
      count: formatNumber(statsData?.activeLoans),
      icon: <LuBriefcase size={24} />,
      textColor: "text-[#92400E]",
      iconBg: "bg-amber-100/50 text-[#92400E]",
      iconColor: "text-[#92400E]",
    },
    {
      label: "TOTAL LOAN AMOUNT",
      count: formatNumber(statsData?.totalLoanAmount, true),
      icon: <LuWallet size={24} />,
      textColor: "text-[#0284C7]",
      iconBg: "bg-sky-50 text-[#0284C7]",
      iconColor: "text-[#0284C7]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
        >
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {item.label}
            </p>
            <h3 className={`text-2xl lg:text-[28px] font-bold ${item.textColor} tracking-tight`}>
              {isLoading && !statsData ? (
                <span className="inline-block w-16 h-8 bg-gray-100 animate-pulse rounded" />
              ) : (
                item.count
              )}
            </h3>
          </div>

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.iconBg}`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeneralStateSection;
