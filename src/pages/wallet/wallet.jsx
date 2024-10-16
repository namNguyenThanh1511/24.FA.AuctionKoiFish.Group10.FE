import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import api from "../../config/axios"; // Sử dụng api đã cấu hình
import { toast } from "react-toastify";
import "./wallet.css"; // Import CSS riêng cho Wallet
import { useNavigate } from "react-router-dom";
import formatToVND from "../../utils/currency";
const Wallet = () => {
  const [balance, setBalance] = useState(0); // Số dư tài khoản
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch số dư tài khoản từ API
  const fetchBalance = async () => {
    try {
      const response = await api.get("account/profile"); // Giả sử có API lấy số dư
      setBalance(response.data.balance);
    } catch (error) {
      toast.error("Failed to fetch balance");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // Hàm xử lý khi nạp tiền
  const handleDeposit = async (values) => {
    setLoading(true);
    const fAmount = parseFloat(values.amount);
    try {
      const response = await api.post("paymentURL/vn-pay", values); // API nạp tiền

      const vnpayUrl = response.data;
      console.log(vnpayUrl);
      // window.location.href = vnpayUrl;
      toast.success("Deposit successful");
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
            <Input type="number" placeholder="Enter amount" />
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
