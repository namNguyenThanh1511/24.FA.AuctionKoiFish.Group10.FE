import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  NotificationOutlined,
  FileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import HeaderLogin from "../HeaderLogin";
import Footer from "../footer/Footer";
const { Header, Sider, Content } = Layout;
// Các item trong menu sidebar
const getItem = (label, key, icon) => ({
  key,
  icon,
  label,
});

const items = [
  getItem("Personal", "1", <PieChartOutlined />),
  getItem("Notification", "2", <NotificationOutlined />),
  getItem("My Auction", "3", <FileOutlined />),
  getItem("Logout", "4", <LogoutOutlined />),
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
            <span
              style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}
            >
              <UserOutlined /> My Account
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header>
          <HeaderLogin />
        </Header>
        <Content style={{ margin: "30px 16px 0" }}>{children}</Content>
        {/* Sử dụng Footer từ components */}
        <Footer />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
