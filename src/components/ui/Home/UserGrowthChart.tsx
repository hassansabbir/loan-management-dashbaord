import { Select } from "antd";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const data = [
  { name: "Growth", value: 20 },
  { name: "Remaining", value: 80 },
];

const COLORS = ["#ffffff", "rgba(255, 255, 255, 0.2)"];

const UserGrowthChart = () => {
  const [year, setYear] = useState<string>("2025");

  return (
    <div className="w-full h-[330px] p-6 bg-[#2F5E81] rounded-sm text-white shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-medium tracking-wide">Total User Growth</h4>
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
      <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-4xl font-semibold">20%</span>
        </div>
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

export default UserGrowthChart;
