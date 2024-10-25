import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import "./register.css";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      await api.post("/register-member", values);
      toast.success("Register Successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const validatePhoneNumber = (_, value) => {
    const phonePattern = /^0\d{9}$/;
    if (!value || phonePattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "Phone number must be 10 digits, start with 0 and not contain letters or special characters."
      )
    );
  };

  const validatePassword = (_, value) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Enter Username" />
          </Form.Item>

          <Form.Item label="Full Name" required>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: "Please enter your first name!" }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  rules={[{ required: true, message: "Please enter your last name!" }]}
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
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: "Please enter your phone number!" }, { validator: validatePhoneNumber }]}
          >
            <Input placeholder="Enter Phone Number" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
          >
            <Input type="email" placeholder="Enter Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }, { validator: validatePassword }]}
          >
            <Input type="password" placeholder="Enter Password" />
          </Form.Item>

          <Form.Item
            label="Re-type Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
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
            <Input type="password" placeholder="Re-type Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              REGISTER
            </Button>
          </Form.Item>
        </Form>

        <div className="signin-link">
          Already a member? <Link to={"/login"}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
