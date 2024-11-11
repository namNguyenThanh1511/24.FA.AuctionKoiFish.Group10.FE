
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  LineChartOutlined,
  LogoutOutlined,
  PullRequestOutlined,
  NotificationOutlined ,
  HistoryOutlined
} from "@ant-design/icons";

const DropdownMenuManager = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/manager-profile/personal">Personal</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<PullRequestOutlined />}>
        <Link to="/manager-profile/manage-request">Manage Request</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<NotificationOutlined />}>
        <Link to="/manager-profile/manage-auction">Manage Auction</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<TeamOutlined />}>
        <Link to="/manager-profile/manage-staff-account">Manage Staff Account</Link>
      </Menu.Item>
      <Menu.Item key="5" icon={<TeamOutlined />}>
        <Link to="/manager-profile/manage-koibreeder-account">Manage Koibreeder Account</Link>
      </Menu.Item>
      <Menu.Item key="6" icon={<HistoryOutlined />}>
        <Link to="/manager-profile/auction-processlog">Auction Process Log</Link>
      </Menu.Item>
      <Menu.Item key="7" icon={<LineChartOutlined />}>
        <Link to="/manager-profile/imcome-overview">Income Overview</Link>
      </Menu.Item>
      <Menu.Item key="8" icon={<LogoutOutlined />} danger onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  );
};

export default DropdownMenuManager;
