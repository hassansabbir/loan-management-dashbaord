/* eslint-disable no-unused-vars */
import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import {
  MdPeopleOutline,
  MdOutlineCategory,
  MdOutlineEvent,
} from "react-icons/md";
import { RxDashboard } from "react-icons/rx";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { BiCrown } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { clearAuth } from "@/utils/auth";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "1",
      icon: <RxDashboard size={20} />,
      label: "Dashboard",
      link: "/",
    },
    {
      key: "5",
      icon: <MdPeopleOutline size={22} />,
      label: "User Info",
      link: "/user-info",
    },
    {
      key: "7",
      icon: <BiCrown size={22} />,
      label: "Subscription",
      link: "/subscription",
    },
    {
      key: "8",
      icon: <TfiLayoutSliderAlt size={22} />,
      label: "Add Slider",
      link: "/add-slider",
    },
    {
      key: "9",
      icon: <MdOutlineCategory size={22} />,
      label: "Category",
      link: "/category",
    },
    {
      key: "10",
      icon: <MdOutlineEvent size={22} />,
      label: "Events",
      link: "/events",
    },
    {
      key: "11",
      icon: <SettingOutlined size={22} />,
      label: "Settings",
      link: "/setting",
    },
    {
      key: "12",
      icon: <IoIosLogOut size={22} />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Sider
        width={305}
        style={{
          position: "fixed",
          height: "100vh",
          zIndex: 2,
          backgroundColor: "white",
          overflow: "auto",
        }}
      >
        <div
          className="logo"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px 0 20px",
          }}
        >
          <Link to="/">
            <p className="text-2xl font-semibold tracking-wider text-primary">
              TradCouples
            </p>
          </Link>
        </div>
        <Menu
          style={{ padding: "20px", border: "none" }}
          mode="inline"
          defaultSelectedKeys={["1"]}
        >
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={item.onClick || undefined}
            >
              <Link to={item.link || "#"} style={{ fontSize: "16px" }}>
                {item.label}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            position: "fixed",
            width: "100vw",
            height: "120px",
            zIndex: 1,
            padding: "0 50px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            style={{
              fontSize: "16px",
              width: 45,
              height: 45,
              marginRight: "10px",
            }}
          />
          <h2>Header Title</h2>
        </Header>

        <Content
          style={{
            marginTop: 80,
            marginBottom: 25,
            marginLeft: 270,
            marginRight: 30,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <div
            style={{ background: "#FeFeFe", borderRadius: 8, height: "100%" }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;