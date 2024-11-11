
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  UserOutlined,
  FileOutlined,
  TransactionOutlined,
  WalletOutlined,
  DollarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const DropdownMenuMember = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  };

  return (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/member-profile/personal">Personal</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<FileOutlined />}>
        <Link to="/member-profile/my-auction">My Auction</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<TransactionOutlined />}>
        <Link to="/member-profile/transaction">transaction</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<WalletOutlined />}>
        <Link to="/member-profile/wallet">Wallet</Link>
      </Menu.Item>
      <Menu.Item key="5" icon={<DollarOutlined />}>
        <Link to="/member-profile/withdraw">Withdraw</Link>
      </Menu.Item>

      <Menu.Item
        key="6"
        icon={<LogoutOutlined />}
        danger
        onClick={handleLogout}
      >
        Log out
      </Menu.Item>
    </Menu>
  );
};

export default DropdownMenuMember;
