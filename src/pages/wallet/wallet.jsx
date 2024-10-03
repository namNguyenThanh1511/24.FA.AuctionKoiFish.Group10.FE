import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import api from "../../config/axios"; // Sử dụng api đã cấu hình
import { toast } from "react-toastify";
import "./wallet.css"; // Import CSS riêng cho Wallet

const Wallet = () => {
  const [balance, setBalance] = useState(0); // Số dư tài khoản
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch số dư tài khoản từ API
  const fetchBalance = async () => {
    try {
      const response = await api.get("wallet/balance"); // Giả sử có API lấy số dư
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
    try {
      const response = await api.post("wallet/deposit", { amount: values.amount }); // API nạp tiền
      toast.success("Deposit successful");
      setBalance(balance + parseFloat(values.amount)); // Cập nhật số dư sau khi nạp
      form.resetFields();
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
        <p>${balance.toFixed(2)}</p>
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
            <Input placeholder="Enter amount" />
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
