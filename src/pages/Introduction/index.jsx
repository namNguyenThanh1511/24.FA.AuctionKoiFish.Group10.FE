import React, { useState } from "react";
import {
  RightOutlined,
  UserOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import "./index.css";
import { useNavigate } from "react-router-dom";

function Introduction() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleStep = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const steps = [
    {
      title: "Step 1: Register or Login",
      description: (
        <>
          If you don’t have an account, click on the <b>Register</b> button to
          sign up. If you already have an account, click <b>Login</b>.
          <div className="buttons">
            <button className="intro-btn" onClick={() => navigate("/register")}>
              Register <ArrowRightOutlined />
            </button>
            <button className="intro-btn" onClick={() => navigate("/login")}>
              Login <ArrowRightOutlined />
            </button>
          </div>
        </>
      ),
      icon: <UserOutlined />,
    },
    {
      title: "Step 2: Access Your Wallet",
      description:
        "After logging in, click on the Profile icon on the top menu to access your Wallet page. Deposit funds into your account to start bidding.",
      icon: <WalletOutlined />,
    },
    {
      title: "Step 3: Browse Auctions",
      description:
        "Go to the Auctions section in the top menu. Browse through the available auctions and select one that's currently open.",
      icon: <ShoppingCartOutlined />,
    },
    {
      title: "Step 4: Place Your Bids",
      description:
        "Participate in the auction by placing bids or using the Buy Now option if available. Monitor your bids in real-time to secure your desired Koi.",
      icon: <DollarOutlined />,
    },
    {
      title: "Step 5: Check Your Auctions",
      description:
        "Once you've won an auction, go to My Auctions from the menu to review your won items and track the shipping status.",
      icon: <RightOutlined />,
    },
    {
      title: "Step 6: Withdraw Funds",
      description:
        "To withdraw your remaining balance, go to the Withdraw section in your profile and submit a withdrawal request.",
      icon: <DollarOutlined />,
    },
  ];

  return (
    <div className="introduction-container">
      <h1 className="intro-title">Welcome to Auction Legend Koi</h1>
      <p className="intro-description">
        Follow these simple steps to participate in the auction and enjoy the
        best Koi fish from renowned breeders.
      </p>

      <div className="steps-section">
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <div className="step-header" onClick={() => toggleStep(index)}>
              {step.icon}
              <span className="step-title">{step.title}</span>
              <span
                className={`arrow-icon ${activeIndex === index ? "open" : ""}`}
              >
                <RightOutlined />
              </span>
            </div>
            {activeIndex === index && (
              <div className="step-content">
                <p>{step.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Introduction;
