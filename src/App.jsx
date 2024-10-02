import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePages/HomePage";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Profile from "./pages/profile/profile";
import Detail from "./pages/Details/detail";
import Auction from "./pages/Auctions/Auction";

function App() {
  const router = createBrowserRouter([
    {
      path: "/", // Đường dẫn gốc trỏ tới trang HomePage
      element: <HomePage />,
    },
    {
      path: "/homepage", // Trang này có thể giữ lại nếu cần
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/auctions", // Đường dẫn cho trang Auctions
      element: <Auction />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
