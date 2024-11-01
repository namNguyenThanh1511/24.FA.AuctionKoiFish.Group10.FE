import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  LogoutOutlined,
  WalletOutlined,
  DollarOutlined,
  TransactionOutlined,
} from "@ant-design/icons";

import Footer from "../../footer/Footer";
import { Link, Outlet, useNavigate } from "react-router-dom"; // Import useNavigate
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

const MemberProfileLayout = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const items = [
    getItem("Personal", "personal", <TeamOutlined />),
    getItem("My Auction", "my-auction", <FileOutlined />),
    getItem("Transaction", "transaction", <TransactionOutlined />),
    getItem("Wallet", "wallet", <WalletOutlined />),
    getItem("Withdraw", "withdraw", <DollarOutlined />),
    getItem("Logout", "logout", <LogoutOutlined />, handleLogout),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
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

        <Footer />
      </Layout>
    </Layout>
  );
};

export default MemberProfileLayout;
