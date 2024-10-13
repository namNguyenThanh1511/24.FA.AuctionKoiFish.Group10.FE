import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePages/HomePage";
import Login from "./pages/login/login";
import Register from "./pages/register/register";

import Wallet from "./pages/wallet/wallet"; // Import trang Wallet
import Auction from "./pages/Auctions/Auction";

import ManageKoiFish from "./pages/KOI_BREEDER/koiFish";
import Layout from "./layout/general-layout";
import Detail from "./pages/Details/detail";
import ManageAuctionRequestOfKoiBreeder from "./pages/KOI_BREEDER/auctionRequest";
import About from "./pages/About/about";

import MemberProfileLayout from "./components/profile-layout/member-profile-layout";
import ManagerProfileLayout from "./components/profile-layout/manager-profile-layout";
import Personal from "./pages/MEMBER/personal";
import KoibreederProfileLayout from "./components/profile-layout/koibreeder-profile-layout";
import StaffProfileLayout from "./components/profile-layout/staff-profile-layout";
import ManageAuctionRequest from "./pages/STAFF/manage-auction-request";
import ManagerManageAuctionRequest from "./pages/MANAGER/manage-auction-request";
import ManageAuctionSessionManager from "./pages/MANAGER/manage-auction-session";

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
      path: "/member-profile",
      element: <MemberProfileLayout />,
      children: [
        {
          path: "personal",
          element: <Personal />,
        },
        {
          path: "wallet",
          element: <Wallet />,
        },
      ],
    },
    {
      path: "/koibreeder-profile",
      element: <KoibreederProfileLayout />,
      children: [
        {
          path: "personal",
          element: <Personal />,
        },
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
    {
      path: "/staff-profile",
      element: <StaffProfileLayout />,
      children: [
        {
          path: "personal",
          element: <Personal />,
        },
        {
          path: "manage-auction-request",
          element: <ManageAuctionRequest />,
        },
        {
          path: "manage-assigned-session",
          element: <div>manage-assigned-session</div>,
        },
      ],
    },
    {
      path: "/manager-profile",
      element: <ManagerProfileLayout />,
      children: [
        {
          path: "personal",
          element: <Personal />,
        },
        {
          path: "manage-request",
          element: <ManagerManageAuctionRequest />,
        },
        {
          path: "manage-auction",
          element: <ManageAuctionSessionManager />,
        },
        {
          path: "manage-staff-account",
          element: <div>hello</div>,
        },
        {
          path: "manage-koibreeder-account",
          element: <div>hello</div>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
