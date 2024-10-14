import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import "./resetpassword.css";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy token từ URL (ví dụ: /reset-password?token=abc123)
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error(
        "Token is missing or invalid. Please request a new password reset link."
      );
      // Điều hướng về forgot-password nếu token không có
    }
  }, [token, navigate]);

  const onFinish = async (values) => {
    try {
      await api.post("/reset-password", {
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      toast.success("Password has been reset successfully.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const validatePassword = (_, value) => {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!value || passwordPattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "New password must be at least 8 characters long, contain letters, numbers, and at least one special character."
      )
    );
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Reset Password</h2>
        <Form name="reset-password" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your new password!" },
              { validator: validatePassword },
            ]}
          >
            <Input type="password" placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input type="password" placeholder="Re-enter new password" />
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
      </div>
    </div>
  );
};

export default ResetPassword;
