import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

// Helper function to create menu items
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`}> {label} </Link>,
  };
}

const items = [
  getItem("Koi Fish", "koiFish", <PieChartOutlined />),
  getItem("Auction Request", "auctionRequest", <PieChartOutlined />),
  // getItem("Product", "product", <PieChartOutlined />),
  // getItem("Voucher", "voucher", <PieChartOutlined />),
]; // param 1 : name ; param 2 : key ; param 3 : icon

const Dashboard = ({title}) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            zIndex: 100,
            color: "white",
            textAlign: "center",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "27px",
            fontWeight: "bold",
          }}
          className="demo-logo-vertical"
        >
          Dashboard
        </div>

        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>{title}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
            {/* Display children */}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
