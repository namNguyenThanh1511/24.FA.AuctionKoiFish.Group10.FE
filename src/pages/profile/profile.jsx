// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Breadcrumb } from "antd";
import api from "../../config/axios"; // Sử dụng api đã cấu hình
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import "./profile.css";


const Profile = () => {
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch dữ liệu người dùng từ API và đổ vào form
  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`account/profile`);
      const userData = response.data;
      form.setFieldsValue({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Hàm xử lý khi lưu thay đổi profile
  const handleSaveProfile = async (values) => {
    setLoading(true);
    try {
      // Giả sử bạn sẽ có API cập nhật thông tin user
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xác thực số điện thoại
  const validatePhoneNumber = (_, value) => {
    const phonePattern = /^0\d{9}$/;
    if (!value || phonePattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "Phone number must be 10 digits, start with 0, and not contain letters or special characters."
      )
    );
  };

  return (
  
      <div className="profile-form">
        <h2>My profile</h2>
        <h4>Manage your profile information to keep your account secure</h4>
        <Form form={form} name="profile" onFinish={handleSaveProfile} layout="vertical">
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
            label="Phone"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              { validator: validatePhoneNumber },
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
            <Input type="email" placeholder="Enter Email" disabled />
          </Form.Item>

          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Save Change
            </Button>
          </Form.Item>
        </Form>
      </div>
    
  );
};

export default Profile;
