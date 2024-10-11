import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  NotificationOutlined,
  FileOutlined,
  LogoutOutlined,
  WalletOutlined,
  TransactionOutlined,
} from "@ant-design/icons";

import Footer from "../../footer/Footer";
import { Link, Outlet } from "react-router-dom";
import HeaderLogin from "../../header-logged-in";
const { Header, Sider, Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`${key}`}> {label} </Link>,
  };
}

const items = [
  getItem("Personal", "personal", <PieChartOutlined />),
  getItem("Manage Request", "manage-request", <PieChartOutlined />),
  getItem("Manage Auction", "manage-auction", <NotificationOutlined />),
  getItem("Manage Staff Account", "manage-staff-account", <FileOutlined />),
  getItem("Manage Koi Breeder Account", "manage-koibreeder-account", <TransactionOutlined />),
  getItem("Logout", "logout", <LogoutOutlined />),
];

const ManagerProfileLayout = ({ children, collapsed, setCollapsed }) => {
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
        <Menu theme="dark" defaultSelectedKeys={["personal"]} mode="inline" items={items} />
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
