import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePages/HomePage";
import Login from "./pages/login/login";
import Register from "./pages/register/register";

import Wallet from "./pages/wallet/wallet";
import Auction from "./pages/Auctions/Auction";

import ManageKoiFish from "./pages/KOI_BREEDER/koiFish";
import Layout from "./layout/general-layout";

import MyAuction from "./pages/Member-MyAuction/Member-MyAuction";
import ForgotPassword from "./pages/forgotpassword/forgotpassword";
import ResetPassword from "./pages/resetpassword/resetpassword";
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
import ManageKoiBreederAccount from "./pages/MANAGER/manage-koibreeder-account";
import ManageStaffAccount from "./pages/MANAGER/manage-staff-account";
import PaymentSuccess from "./pages/payment-notification";
import Detail from "./pages/Details_Auction_fish/detail";
import ManageMemberAccount from "./pages/STAFF/manage-member-account";
import IncomeOverview from "./pages/MANAGER/imcome-overview";
import WithDraw from "./pages/withdraw";
import WithdrawRequest from "./pages/STAFF/withdraw-request";
import Transaction from "./pages/transaction";
import AssignedAuctions from "./pages/STAFF/assigned-auctions";
import AuctionProcessLog from "./pages/MANAGER/auction-processlog";
import EditVariety from "./pages/STAFF/edit-variety";
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
          path: "/auctions/:auctionSessionId", // Đường dẫn cho trang chi tiết
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
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
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
          path: "my-auction",
          element: <MyAuction />,
        },
        {
          path: "transaction",
          element: <Transaction />,
        },
        {
          path: "wallet",
          element: <Wallet />,
        },
        {
          path: "withdraw",
          element: <WithDraw />,
        },
        {
          path: "wallet/success",
          element: <PaymentSuccess />,
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
          path: "transaction",
          element: <Transaction />,
        },
        {
          path: "withdraw",
          element: <WithDraw />,
        },
        {
          path: "auctionRequest",
          element: <ManageAuctionRequestOfKoiBreeder />,
        },
        {
          path: "wallet",
          element: <Wallet />,
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
          element: <AssignedAuctions />,
        },
        {
          path: "manage-member-account",
          element: <ManageMemberAccount />,
        },
        {
          path: "edit-variety",
          element: <EditVariety />,
        },
        {
          path: "withdraw-request",
          element: <WithdrawRequest />,
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
          element: <ManageStaffAccount />,
        },
        {
          path: "manage-koibreeder-account",
          element: <ManageKoiBreederAccount />,
        },
        {
          path: "auction-processlog",
          element: <AuctionProcessLog />,
        },
        {
          path: "imcome-overview",
          element: <IncomeOverview />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
