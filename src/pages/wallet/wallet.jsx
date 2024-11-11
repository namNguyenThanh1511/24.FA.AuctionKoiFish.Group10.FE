import React, { useEffect, useState } from "react";
import { Form, Input, Button, InputNumber, message } from "antd";
import api from "../../config/axios";
import { toast } from "react-toastify";
import "./wallet.css";
import formatToVND from "../../utils/currency";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const roleEnum = useSelector((state) => state.user.roleEnum);
  const navigate = useNavigate();
  // Fetch số dư tài khoản từ API
  const fetchBalance = async () => {
    try {
      const response = await api.get("user/balance");
      setBalance(response.data.balance);
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  useEffect(() => {
    if (roleEnum !== "KOI_BREEDER" && roleEnum !== "MEMBER") {
      message.error("You do not have permission to access this page.");
      navigate("/");
      return;
    }

    fetchBalance();
  }, [roleEnum, navigate]);

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleDeposit = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("paymentURL/vn-pay", {
        amount: values.amount,
      }); // API nạp tiền
      toast.success("Deposit successful");
      window.location.href = response.data;
      fetchBalance();
      form.resetFields();
      fetchBalance();
    } catch (error) {
      toast.error("Failed to deposit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-container">
      <h2>My Wallet</h2>

      {/* Hiển thị số dư tài khoản */}
      <div className="balance-info">
        <h4>Your Balance:</h4>
        <p>{formatToVND(balance)}</p>
      </div>

      {/* Form nạp tiền */}
      <div className="deposit-form">
        <h4>Deposit Money</h4>
        <Form
          form={form}
          name="deposit"
          onFinish={handleDeposit}
          layout="vertical"
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Please enter an amount to deposit!" },
              {
                pattern: /^[0-9]*$/,
                message: "Amount must be a valid number!",
              },
            ]}
          >
            <InputNumber
              min={0}
              addonBefore="+"
              addonAfter="đ"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Deposit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Wallet;
