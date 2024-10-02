import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  NotificationOutlined,
  FileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import Footer from "../footer/Footer";
import HeaderLogin from "../header-logged-in";
import { Link } from "react-router-dom";
const { Header, Sider, Content } = Layout;
// Các item trong menu sidebar
const getItem = (label, key, icon) => ({
  key,
  icon,
  label: <Link to={key}>{label}</Link>,
});

const items = [
  getItem("Personal", "1", <PieChartOutlined />),
  getItem("Notification", "notification", <NotificationOutlined />),
  getItem("My Auction", "my-auction", <FileOutlined />),
  getItem("Logout", "log-out", <LogoutOutlined />),
];

const MainLayout = ({ children, collapsed, setCollapsed }) => {
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
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}>
              <UserOutlined /> My Account
            </span>
          )}
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
      </Sider>

      {/* Main Layout */}
      <Layout>
        <HeaderLogin />
        <Content style={{ margin: "30px 16px 0" }}>{children}</Content>
        {/* Sử dụng Footer từ components */}
        <Footer />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
