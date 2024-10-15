import React, { useEffect } from "react";
import { Button, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css"; // Custom styles with unique class names
import { toast } from "react-toastify";
import api from "../../config/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getQueryParams = (search) => {
    return new URLSearchParams(search);
  };

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    const transactionId = queryParams.get("transactionId");
    if (transactionId) {
      const completeTransaction = async () => {
        try {
          await api.put(`depositFunds/${transactionId}`);
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
    <div className="custom-payment-success-container">
      <Result
        icon={<SmileOutlined className="custom-success-icon" />}
        status="success"
        title="Payment Successful!"
        subTitle="Thank you for your payment. Your transaction has been successfully completed."
        extra={[
          <Button key="wallet" type="primary" className="custom-button" onClick={handleGoBack}>
            Go to My Wallet
          </Button>,
          <Button key="home" className="custom-button" onClick={() => navigate("/")}>
            Return Home
          </Button>,
        ]}
        className="custom-result-card"
      />
    </div>
  );
};

export default PaymentSuccess;
