import { Select } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "January", uv: 4000, percentage: 80 },
  { name: "February", uv: 3000, percentage: 75 },
  { name: "March", uv: 2000, percentage: 68 },
  { name: "April", uv: 2780, percentage: 78 },
  { name: "May", uv: 1890, percentage: 82 },
  { name: "June", uv: 2390, percentage: 78 },
  { name: "July", uv: 3490, percentage: 90 },
  { name: "August", uv: 2490, percentage: 100 },
  { name: "September", uv: 1490, percentage: 75 },
  { name: "October", uv: 4490, percentage: 85 },
  { name: "November", uv: 3490, percentage: 88 },
  { name: "December", uv: 1490, percentage: 50 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#94aebf] border-none text-white px-3 py-1 rounded-md shadow-lg outline-none max-w-xs whitespace-nowrap text-center">
        <p className="text-sm font-semibold mb-0">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  return (
    <div className="w-full h-[330px] p-6 bg-[#2F5E81] rounded-sm text-white shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-medium tracking-wide">
          Total Revenue Monthly
        </h4>
        <Select
          defaultValue="2025"
          style={{ width: 100 }}
          bordered={false}
          className="bg-white text-[#2F5E81] rounded-md quote-select"
          dropdownStyle={{ backgroundColor: "#2F5E81" }}
          popupClassName="quote-select-dropdown"
          options={[
            { value: "2025", label: "2025" },
            { value: "2024", label: "2024" },
          ]}
          suffixIcon={<span className="text-[#2F5E81]">▼</span>}
        />
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#e5e7eb", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#e5e7eb", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "rgba(255,255,255,0.5)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#ffffff"
              strokeWidth={3}
              fill="url(#colorGradient)"
              activeDot={{
                r: 6,
                fill: "white",
                stroke: "#2F5E81",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <style>{`
        .quote-select .ant-select-selector {
          background-color: transparent !important;
          border: none !important;
          color: #2F5E81 !important;
        }

        .quote-select-dropdown .ant-select-item {
          color: white !important;
        }

        .quote-select-dropdown .ant-select-item-option-selected {
          background-color: white !important;
          color: #2F5E81 !important;
          font-weight: 600;
        }

        .quote-select-dropdown .ant-select-item-option-active {
            background-color: rgba(255,255,255,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default RevenueChart;
