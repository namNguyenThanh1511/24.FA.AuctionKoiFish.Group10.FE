// src/components/header-avatar-dropdown/header-avatar-dropdown-koibreeder.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  FileOutlined,
  LogoutOutlined,
  TransactionOutlined,
  DollarOutlined,
  WalletOutlined,
  TeamOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

const DropdownMenuKoiBreeder = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Menu>
      <Menu.Item key="1" icon={<TeamOutlined />}>
        <Link to="/koibreeder-profile/personal">Personal</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<NotificationOutlined />}>
        <Link to="/koibreeder-profile/koiFish">My Koi</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<FileOutlined />}>
        <Link to="/koibreeder-profile/auctionRequest">My Auction Request</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<TransactionOutlined />}>
        <Link to="/koibreeder-profile/auctionRequest">Transaction</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<WalletOutlined />}>
        <Link to="/koibreeder-profile/auctionRequest">My Wallet</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<DollarOutlined />}>
        <Link to="/koibreeder-profile/auctionRequest">Withdraw</Link>
      </Menu.Item>
      <Menu.Item
        key="5"
        icon={<LogoutOutlined />}
        danger
        onClick={handleLogout}
      >
        Log out
      </Menu.Item>
    </Menu>
  );
};

export default DropdownMenuKoiBreeder;
