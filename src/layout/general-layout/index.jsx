import React from "react";
import Header from "../../components/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import HeaderLogin from "../../components/header-logged-in";

export default function Layout() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token != null;
  };
  return (
    <div>
      {!isAuthenticated() ? <Header /> : <HeaderLogin />}
      <Outlet />
      <Footer />
    </div>
  );
}
