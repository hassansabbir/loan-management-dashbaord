
import React from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface QuoteData {
  quoteNo: number;
  executive: string;
  manager: string;
  recipe: string;
  weight: string;
  price: string;
  deliveryTime: string;
  status: string;
}

const CustomerDetails: React.FC = () => {

  const quoteColumns: ColumnsType<QuoteData> = [
    {
      title: "Quote No",
      dataIndex: "quoteNo",
      key: "quoteNo",
    },
    {
      title: "Executive",
      dataIndex: "executive",
      key: "executive",
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
    },
    {
      title: "Recipe",
      dataIndex: "recipe",
      key: "recipe",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Delivery Time",
      dataIndex: "deliveryTime",
      key: "deliveryTime",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span className={`px-2 py-1 rounded text-sm ${
          status === "Delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
        }`}>
          {status}
        </span>
      ),
    },
  ];

  const data: QuoteData[] = [
    {
      quoteNo: 2450,
      executive: "Awami Santo",
      manager: "SM. Albard",
      recipe: "NPKC Recipe 1, 1more",
      weight: "32 Tonnes",
      price: "R320,000",
      deliveryTime: "12/1/2024, 12:30 am",
      status: "Delivered",
    },
  ];

  return (
    <div className="bg-gray-100 p-5 rounded-lg">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
        <div className="flex items-center gap-6">
          <img
            src="https://i.ibb.co.com/hF8qFB5L/Rectangle-5330.png"
            alt="customer"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-medium">John Doe</h3>
            <p className="text-gray-600">Customer ID: CUST001</p>
            <p className="text-gray-600">Email: john.doe@example.com</p>
            <p className="text-gray-600">Phone: +123456789</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Quotes List</h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search here"
              prefix={<SearchOutlined className="text-gray-500" />}
              className="w-80 rounded-full h-12"
            />
          </div>
        </div>
        <Table
          columns={quoteColumns}
          dataSource={data}
          rowKey="quoteNo"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default CustomerDetails;
