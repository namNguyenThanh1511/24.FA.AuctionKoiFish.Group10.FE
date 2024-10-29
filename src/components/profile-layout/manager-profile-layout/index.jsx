import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  PullRequestOutlined,
  NotificationOutlined,
  LogoutOutlined,
  UserAddOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import Footer from "../../footer/Footer";
import { Link, Outlet, useNavigate } from "react-router-dom";
import HeaderLogin from "../../header-logged-in";
const { Sider, Content } = Layout;

function getItem(label, key, icon, onClick = null, children) {
  return {
    key,
    icon,
    children,
    label: onClick ? (
      <span onClick={onClick} style={{ cursor: "pointer" }}>
        {label}
      </span>
    ) : (
      <Link to={`${key}`}> {label} </Link>
    ),
  };
}

const ManagerProfileLayout = ({ children, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const items = [
    getItem("Personal", "personal", <TeamOutlined />),
    getItem("Manage Request", "manage-request", <PullRequestOutlined />),
    getItem("Manage Auction", "manage-auction", <NotificationOutlined />),
    getItem(
      "Manage Staff Account",
      "manage-staff-account",
      <UserAddOutlined />
    ),
    getItem(
      "Manage Koi Breeder Account",
      "manage-koibreeder-account",
      <UserAddOutlined />
    ),
    getItem("Income Overview", "imcome-overview", <BarChartOutlined /> ),
    getItem("Logout", "logout", <LogoutOutlined />, handleLogout),
  ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ marginTop: "85px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: "16px",
          }}
        >
          {!collapsed && (
            <span
              style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}
            >
              <UserOutlined /> My Account
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["personal"]}
          mode="inline"
          items={items}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        <HeaderLogin />
        <Content style={{ margin: "30px 16px 0" }}>
          <Outlet />
        </Content>
        {/* Sử dụng Footer từ components */}
        <Footer />
      </Layout>
    </Layout>
  );
};

export default ManagerProfileLayout;
