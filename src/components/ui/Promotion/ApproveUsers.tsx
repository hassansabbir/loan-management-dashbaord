import { useState } from "react";
import { Table, Tag, Space, Button, Avatar } from "antd";

interface User {
  id: number;
  name: string;
  plan: string;
  status: string;
  imgUrl: string;
}

const approveUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    plan: "Monthly",
    status: "pending",
    imgUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Jane Smith",
    plan: "Yearly",
    status: "approved",
    imgUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Michael Brown",
    plan: "Monthly",
    status: "rejected",
    imgUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Emily Davis",
    plan: "Weekly",
    status: "pending",
    imgUrl: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "David Wilson",
    plan: "Quarterly",
    status: "approved",
    imgUrl: "https://i.pravatar.cc/150?img=5",
  },
];

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 50,
  },
  {
    title: "User",
    key: "user",
    render: (record: User) => (
      <Space>
        <Avatar src={record.imgUrl} alt={record.name} />
        {record.name}
      </Space>
    ),
  },
  {
    title: "Plan",
    dataIndex: "plan",
    key: "plan",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      let color = "";
      if (status === "approved") color = "green";
      else if (status === "rejected") color = "red";
      else color = "orange";
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: () => (
      <Space>
        <Button className="bg-green-300 border border-green-600" size="small">
          Approve
        </Button>
        <Button className="text-red-700 border border-red-600" size="small">
          Reject
        </Button>
      </Space>
    ),
  },
];

const ApproveUsersTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="bg-white p-5 rounded-2xl">
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" disabled={!hasSelected}>
          Reload
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={approveUsers}
        rowKey="id"
      />
    </div>
  );
};

export default ApproveUsersTable;
