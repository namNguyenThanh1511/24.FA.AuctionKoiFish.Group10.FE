import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Form,
  Modal,
  Input,
} from "antd";
import api from "../../../config/axios";
import { DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import "./index.css";
import dayjs from "dayjs";

const ManageKoiBreederAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [form] = Form.useForm();

  const fetchAccounts = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    try {
      const response = await api.get("/breeders-pagination", {
        params: {
          page: page - 1,
          size: pageSize,
        },
      });
      console.log("API Response:", response.data);
      const {
        accountResponseList,
        totalElements,
        totalPages,
        pageNumber,
        numberOfElements,
      } = response.data;
      setAccounts(accountResponseList);
      setPagination({
        current: pageNumber + 1, // Adjust for zero-based index
        pageSize: pageSize, // Use the requested page size
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

  const handleBanKoibreederAccount = async (user_id) => {
    try {
      await api.delete(`/account/${user_id}`);
      message.success("Account deleted successfully");
      fetchAccounts();
    } catch (error) {
      message.error("Failed to disable account.");
    }
  };

  const handleUnlockAccount = async (user_id) => {
    try {
      await api.put(`/account/unlock/${user_id}`);
      message.success("Account unlocked successfully.");
      fetchAccounts();
    } catch (error) {
      message.error("Failed to unlock account.");
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
      message.error("Failed to create account.");
    }
  };

  const handleTableChange = (pagination) => {
    // Fetch accounts with the new page and page size
    console.log(pagination);
    fetchAccounts(pagination, pagination.pageSize);
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
      render: (createdDate) => dayjs(createdDate).format("DD-MM-YYYY HH:mm:ss"),
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
      title: "Actions ",
      key: "Actions ",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to disable this account?"
            onConfirm={() => handleBanKoibreederAccount(record.user_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              disabled={record.status === "INACTIVE"}
              type="primary"
              icon={<DeleteOutlined />}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Disable
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Are you sure to unlock this account?"
            onConfirm={() => handleUnlockAccount(record.user_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              icon={<UnlockOutlined />}
              disabled={record.status?.toUpperCase() === "ACTIVE"} // Chuẩn hóa status
            >
              Unlock
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
        pagination={{
          current: pagination.current, // Current page
          pageSize: pagination.pageSize, // Items per page
          total: pagination.total, // Total number of elements
          onChange: handleTableChange, // Handle page change
          showSizeChanger: false, // Optional: hide size changer
        }}
      />

      <Modal
        title="Create KoiBreeder Account"
        open={isModalVisible} // Replaced 'visible' with 'open' for Modal
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateKoiBreederAccount}
          layout="vertical"
        >
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
              { validator: validatePhoneNumber },
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
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 10 }}
            >
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
