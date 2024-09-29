import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import api from "../config/axios"; // Sử dụng api đã cấu hình
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import './profile.css';

const Profile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch dữ liệu người dùng từ API và đổ vào form
  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/profile"); // Giả sử API này trả về thông tin user
      const userData = response.data;

      // Đặt dữ liệu user vào form
      form.setFieldsValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        phone: userData.phone,
        email: userData.email,
      });
    } catch (error) {
      toast.error("Failed to fetch profile data.");
    }
  };

  // Gọi API để lấy dữ liệu khi trang được load
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Hàm xử lý khi lưu thay đổi profile
  const handleSaveProfile = async (values) => {
    setLoading(true);
    try {
      await api.put("/profile", values); // Giả sử API này cập nhật thông tin user
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h2>Profile</h2>
        <Form
          form={form}
          name="profile"
          onFinish={handleSaveProfile}
          layout="vertical"
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
            <Input type="email" placeholder="Enter Email" disabled />
            {/* Email không thể chỉnh sửa */}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
