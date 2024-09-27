import React from "react";
<<<<<<< HEAD
import Homepage from "./pages/HomePage"; // Import Homepage component
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login/login.jsx";
import Register from "./register/register";

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
  ]);
  return <RouterProvider router={router} />;
}
=======
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login/login.jsx";
import Register from "./register/register";

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
  ]);
  return <RouterProvider router={router} />;
}
>>>>>>> 45d13dc09635fe6479e481afe72ba79afe97f407

export default App;
