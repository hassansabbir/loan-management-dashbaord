
import { Table, Button, Popconfirm } from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const dummyData = [
  {
    key: "1",
    barberName: "John Doe",
    serviceName: "Haircut",
    offerPercentage: "20%",
    status: "Pending",
    description: "A stylish haircut with a free wash.",
    priceBefore: "$50",
    priceAfter: "$40",
  },
  {
    key: "2",
    barberName: "Jane Smith",
    serviceName: "Nail Art",
    offerPercentage: "15%",
    status: "Approved",
    description: "Exclusive nail art with a trendy design.",
    priceBefore: "$30",
    priceAfter: "$25",
  },
  {
    key: "3",
    barberName: "Bob Johnson",
    serviceName: "Facial",
    offerPercentage: "10%",
    status: "Rejected",
    description: "Relaxing facial with a free exfoliation.",
    priceBefore: "$40",
    priceAfter: "$36",
  },
  {
    key: "4",
    barberName: "Alice Brown",
    serviceName: "Hair Color",
    offerPercentage: "25%",
    status: "Pending",
    description: "Vibrant hair color with a conditioning treatment.",
    priceBefore: "$70",
    priceAfter: "$52.5",
  },
  {
    key: "5",
    barberName: "Mark Wilson",
    serviceName: "Beard Trim",
    offerPercentage: "30%",
    status: "Approved",
    description: "Neat beard trim with a relaxing hot towel.",
    priceBefore: "$25",
    priceAfter: "$17.5",
  },
  {
    key: "6",
    barberName: "Emily Clark",
    serviceName: "Makeup",
    offerPercentage: "10%",
    status: "Rejected",
    description: "Glam makeup look for a special occasion.",
    priceBefore: "$50",
    priceAfter: "$45",
  },
  {
    key: "7",
    barberName: "Michael Smith",
    serviceName: "Pedicure",
    offerPercentage: "20%",
    status: "Pending",
    description: "Relaxing pedicure with a foot massage.",
    priceBefore: "$35",
    priceAfter: "$28",
  },
  {
    key: "8",
    barberName: "Sophie Green",
    serviceName: "Massage",
    offerPercentage: "15%",
    status: "Approved",
    description: "Swedish massage for stress relief.",
    priceBefore: "$80",
    priceAfter: "$68",
  },
  {
    key: "9",
    barberName: "Daniel Lee",
    serviceName: "Waxing",
    offerPercentage: "10%",
    status: "Rejected",
    description: "Full body waxing service.",
    priceBefore: "$60",
    priceAfter: "$54",
  },
  {
    key: "10",
    barberName: "Olivia Harris",
    serviceName: "Facial",
    offerPercentage: "20%",
    status: "Pending",
    description: "Deep cleansing facial with extractions.",
    priceBefore: "$45",
    priceAfter: "$36",
  },
  {
    key: "11",
    barberName: "David Walker",
    serviceName: "Haircut",
    offerPercentage: "25%",
    status: "Approved",
    description: "Classic men's haircut with a style consultation.",
    priceBefore: "$55",
    priceAfter: "$41.25",
  },
  {
    key: "12",
    barberName: "Charlotte Johnson",
    serviceName: "Nail Art",
    offerPercentage: "15%",
    status: "Pending",
    description: "Customized nail art with gems.",
    priceBefore: "$40",
    priceAfter: "$34",
  },
  {
    key: "13",
    barberName: "Peter Brown",
    serviceName: "Facial",
    offerPercentage: "20%",
    status: "Rejected",
    description: "Anti-aging facial treatment.",
    priceBefore: "$70",
    priceAfter: "$56",
  },
  {
    key: "14",
    barberName: "Sophia Davis",
    serviceName: "Makeup",
    offerPercentage: "10%",
    status: "Approved",
    description: "Professional makeup application for a wedding.",
    priceBefore: "$60",
    priceAfter: "$54",
  },
  {
    key: "15",
    barberName: "Jackie White",
    serviceName: "Pedicure",
    offerPercentage: "15%",
    status: "Pending",
    description: "Nourishing pedicure with a hot stone massage.",
    priceBefore: "$40",
    priceAfter: "$34",
  },
];

const OfferList = () => {
  const columns = [
    {
      title: "Barber Name",
      dataIndex: "barberName",
      key: "barberName",
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price Before Offer",
      dataIndex: "priceBefore",
      key: "priceBefore",
    },
    {
      title: "Price After Offer",
      dataIndex: "priceAfter",
      key: "priceAfter",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Approved", value: "Approved" },
        { text: "Pending", value: "Pending" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value: any, record: any) => record.status.includes(value),
      render: (status: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            status === "Approved"
              ? "bg-green-200 text-green-800"
              : status === "Pending"
              ? "bg-orange-200 text-orange-600"
              : "bg-red-200 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex items-center space-x-2">
          <Popconfirm
            title="Are you sure you want to delete this offer?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
          {record.status === "Pending" && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.key)}
              />
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.key)}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  const handleDelete = (key: string) => {
    console.log(`Deleting offer with key: ${key}`);
    // Add logic to delete offer here
  };

  const handleApprove = (key: string) => {
    console.log(`Approving offer with key: ${key}`);
    // Add logic to approve offer here
  };

  const handleReject = (key: string) => {
    console.log(`Rejecting offer with key: ${key}`);
    // Add logic to reject offer here
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold  my-5">Offer List</h1>
      <Table columns={columns} dataSource={dummyData} rowKey="key" />
    </div>
  );
};

export default OfferList;
