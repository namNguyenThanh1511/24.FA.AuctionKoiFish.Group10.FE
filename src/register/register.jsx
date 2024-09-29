import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import "./register.css"; // Import CSS riêng cho Register
import api from "../config/aixos";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const handleRegister = async (values) => {
    //submit xuong backend
    try {
    //  values.role = "MEMBER";
      const response = await api.post("register", values);
      toast.success("Register Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Register fail");
    }
  };

  // Xử lý khi form được submit
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  // Hàm xác thực số điện thoại
  const validatePhoneNumber = (_, value) => {
    const phonePattern = /^0\d{9}$/; // Biểu thức chính quy: bắt đầu với 0, sau đó là 10 chữ số
    if (!value || phonePattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "Phone number must be 10 digits, start with 0, and not contain letters or special characters."
      )
    );
  };

  // Hàm xác thực mật khẩu
  const validatePassword = (_, value) => {
    // Biểu thức chính quy: ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!value || passwordPattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "Password must be at least 8 characters long, contain letters, numbers, and at least one special character."
      )
    );
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>REGISTER</h2>
        <Form
          name="register"
          onFinish={handleRegister}
          layout="vertical" // Đặt layout dạng dọc
        >
          {/* Chia thành 2 ô cho First Name và Last Name */}
          <Form.Item label="Name" required>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your first name!",
                    },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  rules={[
                    { required: true, message: "Please enter your last name!" },
                  ]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input placeholder="Enter Address" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              { validator: validatePhoneNumber }, // Sử dụng hàm xác thực cho số điện thoại
            ]}
          >
            <Input placeholder="Enter Phone Number" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input type="email" placeholder="Enter Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { validator: validatePassword }, // Sử dụng hàm xác thực cho mật khẩu
            ]}
          >
            <Input.Password placeholder="Enter Password" />
          </Form.Item>

          <Form.Item
            label="Re-type Password"
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-type Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              REGISTER
            </Button>
          </Form.Item>
        </Form>

        <div className="signin-link">
          Already a member? <a href="/login">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
