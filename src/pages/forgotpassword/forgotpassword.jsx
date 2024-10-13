import React from "react";
import { Form, Input, Button } from "antd";
import "./forgotpassword.css";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await api.post("forgot-password", {
        email: values.email,
      });
      toast.success("Password reset link sent to your email.");
      navigate("/reset-password");
    } catch (err) {
      toast.error(err.response.data || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Forgot Password ?</h2>
        <Form name="forgot-password" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
                type: "email",
              },
            ]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <Button
              className="reset-button"
              type="primary"
              htmlType="submit"
              block
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
        <div className="back-to-login">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
