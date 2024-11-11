import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Breadcrumb } from "antd";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./profile.css";
import { login } from "../../../redux/feature/userSlice";

const Personal = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);

  const fetchUserProfile = async () => {
    try {
      form.setFieldsValue({
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        address: currentUser.address,
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        user_id: currentUser.user_id,
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSaveProfile = async (values) => {
    setLoading(true);
    try {
      const response = await api.put(`account/update-profile-current-user`, values);
      dispatch(login(response.data));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const validatePhoneNumber = (_, value) => {
    const phonePattern = /^0\d{9}$/;
    if (!value || phonePattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Phone number must be 10 digits, starting with 0."));
  };

  return (
    <div className="profile-form">
      <h2>My Profile</h2>
      <h4>Manage your profile information to keep your account secure</h4>
      <Form form={form} name="profile" onFinish={handleSaveProfile} layout="vertical">
        <Form.Item label="Name" required>
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
          rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
        >
          <Input type="email" placeholder="Enter Email" disabled />
        </Form.Item>

        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>

        <Form.Item hidden name="user_id">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Personal;
