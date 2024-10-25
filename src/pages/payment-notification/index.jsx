import React, { useEffect, useState } from "react";
import { Button, Result } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css"; // Custom styles with unique class names
import { toast } from "react-toastify";
import api from "../../config/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState(null); // Track success or error

  const getQueryParams = (search) => {
    return new URLSearchParams(search);
  };

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    const transactionId = queryParams.get("transactionId");
    const responseCode = queryParams.get("vnp_ResponseCode");

    if (responseCode === "00") {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
    if (transactionId) {
      const completeTransaction = async () => {
        try {
          await api.put(
            `depositFunds`,
            { returnURL: window.location.href },
            { headers: { "Content-Type": "application/json" } } // Set Content-Type to JSON
          );
        } catch (err) {
          toast.error(err.response.data);
        }
      };
      completeTransaction();
    }
  }, [location.search]);

  const handleGoBack = () => {
    navigate("/member-profile/wallet"); // Navigate back to the wallet or home page
  };

  return (
    <div className="custom-payment-status-wrapper">
      {isSuccess ? (
        <Result
          icon={<SmileOutlined className="custom-success-icon" />}
          status="success"
          title="Payment Successful!"
          subTitle="Thank you for your payment. Your transaction has been successfully completed."
          extra={[
            <Button
              key="wallet"
              type="primary"
              className="custom-payment-button"
              onClick={handleGoBack}
            >
              Go to My Wallet
            </Button>,
            <Button key="home" className="custom-payment-button" onClick={() => navigate("/")}>
              Return Home
            </Button>,
          ]}
          className="custom-result-container"
        />
      ) : (
        <Result
          icon={<FrownOutlined className="custom-error-icon" />}
          status="error"
          title="Payment Failed"
          subTitle="There was an issue with your payment. Please try again or contact support."
          extra={[
            <Button
              key="retry"
              type="primary"
              className="custom-payment-button"
              onClick={() => navigate("/member-profile/wallet")}
            >
              Retry Payment
            </Button>,
            <Button key="home" className="custom-payment-button" onClick={() => navigate("/")}>
              Return Home
            </Button>,
          ]}
          className="custom-result-container"
        />
      )}
    </div>
  );
};

export default PaymentSuccess;
