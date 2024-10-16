import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Form, Modal, Input } from "antd";
import api from "../../../config/axios";
import {
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import "./index.css";

const ManageKoiBreederAccount = () => {
  const [accounts, setAccounts] = useState([]); // Dữ liệu các tài khoản
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  // Lấy dữ liệu từ API và đổ vào state
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/breeders");
      const accountsData = response.data;
      setAccounts(accountsData); // Gán dữ liệu tài khoản vào state
    } catch (error) {
      message.error("Error fetching account data.");
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi dữ liệu được load
    }
  };

  useEffect(() => {
    fetchAccounts(); // Gọi hàm fetchAccounts khi component được render lần đầu
  }, []);

  const handleBanKoibreederAccount = async (user_id) => {
    try {
      await api.delete(`/account/${user_id}`);
      message.success("Account deleted successfully");
      fetchAccounts(); // Tải lại danh sách tài khoản sau khi xóa
    } catch (error) {
      message.error("Failed to disable account.");
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
  const handleCreateKoiBreederAccount = async (values) => {
    try {
      await api.post("/manager/create-breeder-account", values);
      setIsModalVisible(false);
      form.resetFields();
      fetchAccounts();
    } catch (error) {
      message.error("Failed to create account. ");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Creation Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
    },
    {
      title: "Role",
      dataIndex: "roleEnum",
      key: "roleEnum",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === "ACTIVE" ? "green" : "red" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Account Lock",
      key: "Account Lock",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to disable this account?"
            onConfirm={() => handleBanKoibreederAccount(record.user_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Disable
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="manage-account-container" style={{ margin: "100px auto" }}>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: "20px" }}
      >
        Create KoiBreeder Account
      </Button>

      <Table
        className="table-manager-account"
        columns={columns}
        dataSource={accounts}
        loading={loading}
        rowKey={(record) => record.user_id}
        pagination={{ pageSize: 10 }}
      />
    <Modal
    title="Create KoiBreeder Account"
    visible={isModalVisible}
    onCancel={()=> setIsModalVisible(false)}
    footer={null}
    >
       <Form form={form} onFinish={handleCreateKoiBreederAccount} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter phone number" },
              { validator: validatePhoneNumber }, // Thêm hàm kiểm tra số điện thoại
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
              Submit
            </Button>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
          </Form.Item>
        </Form>
      
    </Modal>




    </div>
  );
};

export default ManageKoiBreederAccount;
