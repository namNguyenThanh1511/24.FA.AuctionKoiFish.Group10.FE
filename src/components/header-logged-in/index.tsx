
import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";
import { useSelector } from "react-redux";
import "./index.css";
import avatar from "../../images/avata.jpg";
import DropdownMenuMember from "../header-avatar-dropdown/header-avatar-dropdown-member";
import DropdownMenuStaff from "../header-avatar-dropdown/header-avatar-dropdown-staff";
import DropdownMenuManager from "../header-avatar-dropdown/header-avatar-dropdown-manager";
import DropdownMenuKoiBreeder from "../header-avatar-dropdown/header-avatar-dropdown-koibreeder";

const HeaderLogin = () => {
  const roleEnum = useSelector((state) => state.user.roleEnum);


  let DropdownMenuComponent;
  if (roleEnum === "MEMBER") {
    DropdownMenuComponent = <DropdownMenuMember />;
  } else if (roleEnum === "STAFF") {
    DropdownMenuComponent = <DropdownMenuStaff />;
  } else if (roleEnum === "MANAGER") {
    DropdownMenuComponent = <DropdownMenuManager />;
  } else if (roleEnum === "KOI_BREEDER") {
    DropdownMenuComponent = <DropdownMenuKoiBreeder />;
  } else {
    DropdownMenuComponent = <DropdownMenuMember />; 
  }

  return (
    <header className="header">
      <div className="logo">
        <h1>Auction Legend Koi</h1>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/auctions"}>Auctions</Link>
          </li>
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <a href="/Introduction">Introduction</a>
          </li>
          <li>
            <Dropdown overlay={DropdownMenuComponent} trigger={["hover"]} placement="bottomRight">
              <div className="avatar-wrapper">
                <img src={avatar} alt="User Avatar" className="avatar" />
              </div>
            </Dropdown>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderLogin;
