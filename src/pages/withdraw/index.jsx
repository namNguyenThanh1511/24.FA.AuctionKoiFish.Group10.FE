import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Table,
  Tag,
  Pagination,
  Modal,
  Tooltip,
} from "antd";
import api from "../../config/axios"; 
import dayjs from "dayjs";

const WithDraw = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [pageSize] = useState(5); 
  const [isAddRequestModalVisible, setIsAddRequestModalVisible] =
    useState(false); // Modal cho việc thêm yêu cầu
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // Modal cho việc xem chi tiết
  const [selectedRequest, setSelectedRequest] = useState(null); // Lưu thông tin của yêu cầu được chọn

  // Fetch data  từ API
  const fetchWithdrawData = async (page = currentPage) => {
    try {
      const response = await api.get(
        `/withDrawRequest/currentUser/pagination?page=${
          page - 1
        }&size=${pageSize}`
      );
      console.log("Withdrawal data fetched: ", response.data); 
      setWithdrawRequests(response.data.withDrawRequestResponseDTOList);
      setTotalRequests(response.data.totalElements);
    } catch (error) {
      message.error("Failed to load withdrawal data");
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchWithdrawData(currentPage);
  }, [currentPage]);

  //hàm form rút tiền
  const handleWithdraw = async (values) => {
    setLoading(true);
    try {
      await api.post("/withDraw", values);
      message.success("Withdrawal request submitted successfully");
      form.resetFields(); // Reset form sau khi gửi
      setIsAddRequestModalVisible(false); // Đóng modal sau khi gửi
      fetchWithdrawData(currentPage); // Tải lại danh sách yêu cầu rút tiền
    } catch (error) {
      message.error("Failed to submit withdrawal request");
      console.error("Submit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở  chi tiết
  const showDetails = (record) => {
    setSelectedRequest(record); // Lưu yêu cầu được chọn để hiển thị
    setIsDetailModalVisible(true); // Mở modal chi tiết
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
        let color =
          status === "APPROVED"
            ? "green"
            : status === "PENDING"
            ? "orange"
            : "volcano";
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
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
    <div
      style={{
        padding: "50px",
      }}
    >
      <Button
        type="primary"
        onClick={() => setIsAddRequestModalVisible(true)} // Mở modal để thêm yêu cầu
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
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedRequest(null); // Reset yêu cầu đã chọn
        }}
        footer={null}
      >
        {selectedRequest ? (
          <>
            <p>
              <strong>Response Note:</strong>{" "}
              {selectedRequest.responseNote || "N/A"}
            </p>
            <p>
              <strong>Image :</strong>
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
        dataSource={withdrawRequests}
        columns={columns}
        rowKey="id" // Sử dụng ID duy nhất cho mỗi yêu cầu rút tiền
        style={{ marginTop: "20px" }}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalRequests}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger={false} 
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </div>
  );
};

export default WithDraw;
