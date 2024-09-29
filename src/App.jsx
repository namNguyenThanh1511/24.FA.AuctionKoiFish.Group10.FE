import React from "react";
import Homepage from "./HomePages/HomePage"; // Import Homepage component
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login/login.jsx";
import Register from "./register/register";
import Profile from "./profile/profile.jsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />, // Trang mặc định là Homepage
    },
    {
      path: "/homepage", // Bạn có thể giữ lại đường dẫn cho Homepage
      element: <Homepage />,
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
  ]);

  return <RouterProvider router={router} />;
}

export default App;
