import { Button, Select, Table } from "antd";
import { EyeOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

const { Option } = Select;

interface UserData {
  key: string;
  serialNo: string;
  name: string;
  email: string;
  location: string;
  status: "Active" | "Blocked";
}

const dummyData: UserData[] = [
  {
    key: "1",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
  {
    key: "2",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Blocked",
  },
  {
    key: "3",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
  {
    key: "4",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
  {
    key: "5",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
  {
    key: "6",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
  {
    key: "7",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
  {
    key: "8",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
  {
    key: "9",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
  {
    key: "10",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Blocked",
  },
  {
    key: "11",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
  {
    key: "12",
    serialNo: "#25632",
    name: "Md Kamran Ali",
    email: "Kamran.Uxui@Gmail.Com",
    location: "Dhaka Bangladesh",
    status: "Active",
  },
];

const Users = () => {
  const [filterStatus, setFilterStatus] = useState("Active");

  const columns: ColumnsType<UserData> = [
    {
      title: "Serial No",
      dataIndex: "serialNo",
      key: "serialNo",
      className: "text-gray-300",
      render: (_1, _2, index) => (
        <span className="text-white">#{index + 1}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: "text-white",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "text-white",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      className: "text-white",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`px-4 py-1.5 rounded-md text-sm font-medium ${
            status === "Active"
              ? "bg-[#22c55e] text-white"
              : "bg-[#ef4444] text-white"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={
              record.status === "Active" ? (
                <UnlockOutlined className="text-white text-lg" />
              ) : (
                <LockOutlined className="text-white text-lg" />
              )
            }
            className="hover:!bg-transparent"
          />
          <Button
            type="text"
            icon={<EyeOutlined className="text-white text-lg" />}
            className="hover:!bg-transparent"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[#2F5E81] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-normal text-white">User Management</h1>
        <Select
          defaultValue="Active"
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-32 user-filter-select"
          bordered={false}
          suffixIcon={<span className="text-white">▼</span>}
        >
          <Option value="Active">Active</Option>
          <Option value="Blocked">Blocked</Option>
        </Select>
      </div>

      <div className="custom-table-wrapper">
        <Table
          columns={columns}
          dataSource={dummyData}
          pagination={{ pageSize: 10 }}
          rowClassName={() => "custom-table-row"}
          className="bg-transparent"
        />
      </div>

      <style>{`
        /* Dropdown Styles */
        .user-filter-select .ant-select-selector {
          background-color: transparent !important;
          border: 1px solid rgba(255,255,255,0.3) !important;
          color: white !important;
          border-radius: 4px !important;
          height: 40px !important;
          display: flex !important;
          align-items: center !important;
        }

        /* Table Styles */
        .custom-table-wrapper .ant-table {
          background: transparent !important;
        }

        .custom-table-wrapper .ant-table-thead > tr > th {
          background: #366080 !important;
          color: #e5e7eb !important;
          border-bottom: none !important;
          font-weight: 500;
          padding: 16px 24px !important;
        }

        .custom-table-wrapper .ant-table-tbody > tr > td {
          border-bottom: 8px solid #2F5E81 !important; /* Spacing color match background */
          background: rgba(255, 255, 255, 0.05) !important;
          padding: 20px 24px !important;
          color: white !important;
        }

        .custom-table-wrapper .ant-table-tbody > tr:hover > td {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        /* Pagination Styles */
        .custom-table-wrapper .ant-pagination {
          margin-top: 24px !important;
          justify-content: flex-end !important;
        }

        .custom-table-wrapper .ant-pagination-item {
          background: transparent !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }

        .custom-table-wrapper .ant-pagination-item a {
          color: white !important;
        }

        .custom-table-wrapper .ant-pagination-item-active {
          background: #366080 !important;
          border-color: #366080 !important;
        }

        .custom-table-wrapper .ant-pagination-prev .ant-pagination-item-link,
        .custom-table-wrapper .ant-pagination-next .ant-pagination-item-link {
          background: transparent !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default Users;
