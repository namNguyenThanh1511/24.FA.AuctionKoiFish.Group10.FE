import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  NotificationOutlined,
  FileOutlined,
  LogoutOutlined,
  WalletOutlined,
  TransactionOutlined,
  TeamOutlined,
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

const KoibreederProfileLayout = ({ children, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };
  const items = [
    getItem("Personal", "personal", <TeamOutlined />),
    getItem("My Koi", "koiFish", <NotificationOutlined />),
    getItem("My Auction Request", "auctionRequest", <FileOutlined />),
    getItem("Wallet", "wallet", <WalletOutlined />),
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

export default KoibreederProfileLayout;
