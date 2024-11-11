import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Table, Tag, Modal, Tooltip } from "antd";
import api from "../../config/axios";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const WithDraw = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [isAddRequestModalVisible, setIsAddRequestModalVisible] =
    useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const roleEnum = useSelector((state) => state.user.roleEnum);
  const navigate = useNavigate();
  const fetchWithdrawData = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    try {
      const response = await api.get(
        "/withDrawRequest/currentUser/pagination",
        {
          params: {
            page: page - 1,
            size: pageSize,
          },
        }
      );
      console.log("Withdrawal data fetched: ", response.data);
      const { withDrawRequestResponseDTOList, totalElements, pageNumber } =
        response.data;

      setWithdrawRequests(withDrawRequestResponseDTOList);
      setPagination({
        current: pageNumber + 1,
        pageSize: pageSize,
        total: totalElements,
      });
    } catch (error) {
      message.error("Failed to load withdrawal data");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (roleEnum !== "KOI_BREEDER" && roleEnum !== "MEMBER") {
      message.error("You do not have permission to access this page.");
      navigate("/");
      return;
    }
  
    fetchWithdrawData();
  }, [roleEnum, navigate]);
  
  useEffect(() => {
    fetchWithdrawData();
  }, []);
  

  // Hàm xử lý gửi yêu cầu rút tiền
  const handleWithdraw = async (values) => {
    setLoading(true);
    try {
      await api.post("/withDraw", values);
      message.success("Withdrawal request submitted successfully");
      form.resetFields();
      setIsAddRequestModalVisible(false);
      fetchWithdrawData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.response.data);
      console.error("Submit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const showDetails = (record) => {
    setSelectedRequest(record);
    setIsDetailModalVisible(true);
  };

  const handleTableChange = (pagination) => {
    console.log(pagination);
    fetchWithdrawData(pagination, pagination.pageSize);
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Bank Account Number",
      dataIndex: "bankAccountNumber",
      key: "bankAccountNumber",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "Account Holder Name",
      dataIndex: "bankAccountName",
      key: "bankAccountName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Tooltip title={dayjs(date).format("MMMM D, YYYY, h:mm A")}>
          <span>{dayjs(date).format("YYYY-MM-DD")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "APPROVED"
            ? "green"
            : status === "PENDING"
            ? "orange"
            : "volcano";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Details",
      key: "details",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => showDetails(record)}
          disabled={record.status === "PENDING"}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ margin: "100px auto" }}>
      <Button
        type="primary"
        onClick={() => setIsAddRequestModalVisible(true)}
        style={{ marginBottom: "20px" }}
      >
        + Add Withdraw Request
      </Button>

      {/* Modal thêm yêu cầu rút tiền */}
      <Modal
        title="Withdraw Money"
        visible={isAddRequestModalVisible}
        onCancel={() => setIsAddRequestModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          name="withdraw"
          onFinish={handleWithdraw}
          layout="vertical"
        >
          {/* Các trường nhập cho form */}
          <Form.Item
            label="Bank Account Number"
            name="bankAccountNumber"
            rules={[
              {
                required: true,
                message: "Please enter your bank account number!",
              },
            ]}
          >
            <Input placeholder="Enter Bank Account Number" />
          </Form.Item>
          <Form.Item
            label="Bank Name"
            name="bankName"
            rules={[
              { required: true, message: "Please enter your bank name!" },
            ]}
          >
            <Input placeholder="Enter Bank Name" />
          </Form.Item>
          <Form.Item
            label="Account Holder Name"
            name="bankAccountName"
            rules={[
              {
                required: true,
                message: "Please enter the account holder's name!",
              },
            ]}
          >
            <Input placeholder="Enter Account Holder Name" />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please enter the amount to withdraw!",
              },
            ]}
          >
            <Input placeholder="Enter Amount" type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Submit Withdrawal
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal hiển thị chi tiết yêu cầu */}
      <Modal
        title="Withdraw Request Details"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        {selectedRequest ? (
          <>
            <p>
              <strong>Response Note:</strong>{" "}
              {selectedRequest.responseNote || "N/A"}
            </p>
            <p>
              <strong>Image:</strong>
            </p>
            {selectedRequest.image_url ? (
              <img
                src={selectedRequest.image_url}
                alt="Image"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span>No image available</span>
            )}
            <p>
              <strong>Staff ID:</strong> {selectedRequest.staff?.id || "N/A"}
            </p>
            <p>
              <strong>Staff Username:</strong>{" "}
              {selectedRequest.staff?.username || "N/A"}
            </p>
          </>
        ) : (
          <p>No details available</p>
        )}
      </Modal>

      <Table
        columns={columns}
        dataSource={withdrawRequests}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handleTableChange,
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default WithDraw;
