import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePages/HomePage";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Profile from "./pages/profile/profile";
import Dashboard from "./components/dashboard";
import ManageKoiFish from "./pages/KOI_BREEDER/koiFish";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />, // Trang mặc định là Homepage
    },
    {
      path: "/homepage", // Bạn có thể giữ lại đường dẫn cho Homepage
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
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "koiFish",
          element: <ManageKoiFish />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
