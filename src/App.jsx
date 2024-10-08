import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePages/HomePage";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Profile from "./pages/profile/profile";
import Wallet from "./pages/wallet/wallet"; // Import trang Wallet
import Auction from "./pages/Auctions/Auction";
import Dashboard from "./components/dashboard";
import ManageKoiFish from "./pages/KOI_BREEDER/koiFish";
import Layout from "./layout/general-layout";
import Detail from "./pages/Details/detail";
import MainLayout from "./components/profile/MainLayout";
import ManageAuctionRequestOfKoiBreeder from "./pages/KOI_BREEDER/auctionRequest";
import About from "./pages/About/about";
function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/auctions",
          element: <Auction />,
        },
        {
          path: "/auctions/details",
          element: <Detail />,
        },
        {
          path: "/about",
          element: <About />,
        },
        
        {
          path: "/dashboard/koiBreeder",
          element: <Dashboard title={"Koi Breeder"} />,
          children: [
            {
              path: "koiFish",
              element: <ManageKoiFish />,
            },
            {
              path: "auctionRequest",
              element: <ManageAuctionRequestOfKoiBreeder />,
            },
          ],
        },
      ],
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
      element: <MainLayout />,
      children: [
        {
          path: "personal",
          element: <Profile />,
        },

        {
          path: "wallet", // Trang con Wallet
          element: <Wallet />,
        },
        // Các trang con khác
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
