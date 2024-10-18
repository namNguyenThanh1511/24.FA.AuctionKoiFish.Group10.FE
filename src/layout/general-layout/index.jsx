import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import HeaderLogin from "../../components/header-logged-in";

export default function Layout() {
  const token = localStorage.getItem("token");

  return (
    <div>
      {!token ? <Header /> : <HeaderLogin />}
      <Outlet />
      <Footer />
    </div>
  );
}
