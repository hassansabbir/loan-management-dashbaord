import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useGetAdminFundingChartQuery } from "@/redux/apiSlices/dashboardSlice";

const fallbackMonths = [
  { month: "Jan", funding: 0, repayments: 0 },
  { month: "Feb", funding: 0, repayments: 0 },
  { month: "Mar", funding: 0, repayments: 0 },
  { month: "Apr", funding: 0, repayments: 0 },
  { month: "May", funding: 0, repayments: 0 },
  { month: "Jun", funding: 0, repayments: 0 },
  { month: "Jul", funding: 0, repayments: 0 },
  { month: "Aug", funding: 0, repayments: 0 },
  { month: "Sep", funding: 0, repayments: 0 },
  { month: "Oct", funding: 0, repayments: 0 },
  { month: "Nov", funding: 0, repayments: 0 },
  { month: "Dec", funding: 0, repayments: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[140px]">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-[#1B64F2] font-semibold flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1B64F2]" />
            Funding:
          </span>
          <span>£{(payload[0]?.value || 0).toLocaleString()}</span>
        </p>
        <p className="text-[#10B981] font-semibold flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Repayments:
          </span>
          <span>£{(payload[1]?.value || 0).toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const FundingChart = () => {
  const { data: chartResponse, isLoading } = useGetAdminFundingChartQuery();

  const data =
    chartResponse?.data && chartResponse.data.length > 0
      ? chartResponse.data
      : fallbackMonths;

  // Determine if all values are zero to set a balanced YAxis domain
  const maxVal = Math.max(
    ...data.map((d) => Math.max(Number(d.funding) || 0, Number(d.repayments) || 0)),
    0
  );
  const yDomain = maxVal === 0 ? [0, 100] : [0, "auto"];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Funding vs. Repayments
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Capital flow comparison over time
          </p>
        </div>

        {/* Custom Legend */}
        <div className="flex items-center gap-5 text-xs font-semibold">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B64F2]" />
            <span>Funding</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>Repayments</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[240px] w-full">
        {isLoading && !chartResponse ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#1B64F2]/20 border-t-[#1B64F2] rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B64F2" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1B64F2" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRepayments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#F1F5F9"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                domain={yDomain as any}
                hide={true}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="funding"
                stroke="#1B64F2"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorFunding)"
              />
              <Area
                type="monotone"
                dataKey="repayments"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRepayments)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default FundingChart;
