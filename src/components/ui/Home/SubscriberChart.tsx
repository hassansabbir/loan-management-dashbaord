import { Select } from "antd";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "January", value: 45 },
  { name: "February", value: 75 },
  { name: "March", value: 40 },
  { name: "April", value: 65 },
  { name: "May", value: 85 },
  { name: "June", value: 50 },
  { name: "July", value: 75 },
  { name: "August", value: 38 },
  { name: "September", value: 70 },
  { name: "October", value: 30 },
  { name: "November", value: 30 },
  { name: "December", value: 75 },
];

const SubscriberChart = () => {
  const [year, setYear] = useState<string>("2025");

  return (
    <div className="w-full h-[330px] p-6 bg-[#2F5E81] rounded-sm text-white shadow-sm flex flex-col justify-between rounded-b-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-medium tracking-wide">
          Total Subscriber Monthly
        </h4>
        <Select
          value={year}
          onChange={(value) => setYear(value)}
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
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
            barSize={30}
          >
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#e5e7eb", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#e5e7eb", fontSize: 11 }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            />
            <Bar
              dataKey="value"
              fill="rgba(255, 255, 255, 0.8)"
              radius={[10, 10, 0, 0] as any}
              barSize={50}
              background={
                {
                  fill: "rgba(255, 255, 255, 0.1)",
                  radius: [10, 10, 10, 10],
                } as any
              }
            />
          </BarChart>
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

export default SubscriberChart;
