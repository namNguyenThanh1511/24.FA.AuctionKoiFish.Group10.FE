import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Form, Modal, Input, Tooltip } from "antd";
import api from "../../../config/axios";
import { DeleteOutlined } from "@ant-design/icons";
import "./index.css";
import dayjs from "dayjs";

const ManageStaffAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });
  const [form] = Form.useForm();

  const fetchAccounts = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await api.get("/staffs-pagination", {
        params: {
          page: page - 1,
          size: pageSize,
        },
      });
      console.log("API Response:", response.data);
      const { accountResponseList, totalElements, totalPages, pageNumber, numberOfElements } =
        response.data;
      setAccounts(accountResponseList);
      setPagination({
        current: page + 1,
        pageSize: pageSize,
        total: totalElements,
      });
    } catch (error) {
      message.error("Error fetching account data.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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

  const handleCreateStaffAccount = async (values) => {
    try {
      await api.post("/manager/create-staff-account", values);
      setIsModalVisible(false);
      form.resetFields();
      fetchAccounts();
    } catch (error) {
      message.error("Failed to create account.");
    }
  };

  const handleBanStaffAccount = async (user_id) => {
    try {
      await api.delete(`/account/${user_id}`);
      message.success("Account deleted successfully");
      fetchAccounts();
    } catch (error) {
      message.error("Failed to disable account.");
    }
  };

  const handleTableChange = (pagination) => {
    console.log(paginationn);
    fetchAccounts(paginationn, pagination.pageSize);
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
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Tooltip title={dayjs(date).format("MMMM D, YYYY, h:mm A")}>
          <span>{dayjs(date).format("YYYY-MM-DD")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => (
        <Tooltip title={dayjs(date).format("MMMM D, YYYY, h:mm A")}>
          <span>{dayjs(date).format("YYYY-MM-DD")}</span>
        </Tooltip>
      ),
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
        <span style={{ color: status === "ACTIVE" ? "green" : "red" }}>{status}</span>
      ),
    },
    {
      title: "Account Lock",
      key: "Account Lock",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to disable this account?"
            onConfirm={() => handleBanStaffAccount(record.user_id)}
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
    <div className="staff-account-container" style={{ margin: "100px auto" }}>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)} // Mở modal khi nhấn nút
        style={{ marginBottom: "20px" }}
      >
        Create Staff Account
      </Button>
      <Table
        className="table-staff-account"
        columns={columns}
        dataSource={accounts}
        loading={loading}
        rowKey={(record) => record.user_id}
        pagination={{
          current: pagination.current, // Keep current page as is
          pageSize: pagination.pageSize,
          total: pagination.total, // Total elements
          onChange: handleTableChange, // Handle page change
          showSizeChanger: false, // Optional: hide size changer
        }}
      />
      <Modal
        title="Create Staff Account"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)} // Đóng modal khi nhấn Cancel
        footer={null} // Tùy chỉnh footer của modal
      >
        <Form form={form} onFinish={handleCreateStaffAccount} layout="vertical">
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

export default ManageStaffAccount;
