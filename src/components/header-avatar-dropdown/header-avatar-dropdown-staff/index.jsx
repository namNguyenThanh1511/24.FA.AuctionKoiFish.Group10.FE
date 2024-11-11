
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  UserOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
  TeamOutlined,
  LogoutOutlined,
  EditOutlined,
  DollarOutlined,

} from "@ant-design/icons";

const DropdownMenuStaff = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  };

  return (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/staff-profile/personal">Personal</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<FileDoneOutlined />}>
        <Link to="/staff-profile/manage-auction-request">Auction Request</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<ScheduleOutlined />}>
        <Link to="/staff-profile/manage-assigned-session">Assigned Auction</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<TeamOutlined />}>
        <Link to="/staff-profile/manage-member-account">Member Account</Link>
      </Menu.Item>
      <Menu.Item key="5" icon={<EditOutlined />} >
      <Link to="/staff-profile/edit-variety">Edit Variety</Link>
      </Menu.Item>
      <Menu.Item key="6" icon={<DollarOutlined />} >
      <Link to="/staff-profile/withdraw-request">Withdraw</Link>
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

export default DropdownMenuStaff;
