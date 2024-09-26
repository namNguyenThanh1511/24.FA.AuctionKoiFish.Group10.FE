import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login/login.jsx";
import Register from "./register/register";
import Profile from "./profile/profile.jsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
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
