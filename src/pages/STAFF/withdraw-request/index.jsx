import React, { useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Modal,
  Input,
  Button,
  message,
  Tooltip,
  Tag,
} from "antd";
import api from "../../../config/axios"; 
import dayjs from "dayjs";

const WithdrawRequest = () => {
 
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [pageSize] = useState(5);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [responseNote, setResponseNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState({
    responseNote: "",
    image_url: "",
    userId: "",
    username: "",
  });

  const fetchWithdrawData = async (page = currentPage) => {
    try {
      const response = await api.get(
        `/withDrawRequest/pagination?page=${page - 1}&size=${pageSize}`
      );
      console.log("Withdrawal data fetched: ", response.data);
      setWithdrawRequests(response.data.withDrawRequestResponseDTOList);
      setTotalRequests(response.data.totalElements);
    } catch (error) {
      message.error("Failed to load withdrawal data");
      console.error("Fetch Error:", error);
    }
  };

  const showDetails = (record) => {
    setSelectedDetail({
      responseNote: record.responseNote,
      image_url: record.image_url,
      userId: record.user?.id , 
      username: record.user?.username , 
    });
    setIsDetailModalVisible(true); // Mở modal chi tiết
  };

  useEffect(() => {
    fetchWithdrawData(currentPage);
  }, [currentPage]);

  const handleReject = async () => {
    try {
      await api.put(`/withDraw/reject/${selectedRequestId}`, {
        responseNote,
        image_url: imageUrl,
      });
      message.success("Withdrawal request rejected successfully");
      setIsRejectModalVisible(false);
      fetchWithdrawData(currentPage);
      setResponseNote("");
      setImageUrl("");
    } catch (error) {
      message.error(
        "Failed to reject withdrawal request: " + (error.response?.data || error.message)
      );
      console.error("Reject Error:", error);
    }
  };

  const handleApprove = async () => {
    try {
      await api.put(`/withDraw/approve/${selectedRequestId}`, {
        responseNote,
        image_url: imageUrl,
      });
      message.success("Withdrawal request approved successfully");
      setIsApproveModalVisible(false);
      fetchWithdrawData(currentPage);
      setResponseNote("");
      setImageUrl("");
    } catch (error) {
      message.error(
        "Failed to approve withdrawal request: " + (error.response?.data || error.message)
      );
      console.error("Approve Error:", error);
    }
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
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => {
        const isApproved = record.status === "APPROVED";
        const isRejected = record.status === "REJECTED";

        if (isApproved) {
          return <Tag color="green">This request is approved</Tag>;
        }

        if (isRejected) {
          return <Tag color="volcano">This request is rejected</Tag>;
        }

        return (
          <>
            <Button
              type="primary"
              danger
              onClick={() => {
                setSelectedRequestId(record.id);
                setIsRejectModalVisible(true);
              }}
            >
              Reject
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSelectedRequestId(record.id);
                setIsApproveModalVisible(true);
              }}
              style={{ marginLeft: "10px" }}
            >
              Approve
            </Button>
          </>
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
    <div style={{ margin: "100px auto" }}>
      <Table
        dataSource={withdrawRequests}
        columns={columns}
        rowKey="id"
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

      {/* Modal từ chối yêu cầu */}
      <Modal
        title="Reject Withdrawal Request"
        visible={isRejectModalVisible}
        onCancel={() => setIsRejectModalVisible(false)}
        footer={null}
      >
        <Input
          placeholder="Response Note"
          value={responseNote}
          onChange={(e) => setResponseNote(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Button type="primary" onClick={handleReject} block>
          Submit Reject
        </Button>
      </Modal>

      {/* Modal phê duyệt yêu cầu */}
      <Modal
        title="Approve Withdrawal Request"
        visible={isApproveModalVisible}
        onCancel={() => setIsApproveModalVisible(false)}
        footer={null}
      >
        <Input
          placeholder="Response Note"
          value={responseNote}
          onChange={(e) => setResponseNote(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Button type="primary" onClick={handleApprove} block>
          Submit Approve
        </Button>
      </Modal>

      {/* Modal chi tiết yêu cầu */}
      <Modal
        title="Withdrawal Request Details"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <p>
          <strong>User ID:</strong> {selectedDetail.userId }
        </p>
        <p>
          <strong>Username:</strong> {selectedDetail.username }
        </p>
        <p>
          <strong>Response Note:</strong>{" "}
          {selectedDetail.responseNote || "No response note provided"}
        </p>
        <p>
          <strong>Image URL:</strong>
        </p>
        {selectedDetail.image_url ? (
          <img src={selectedDetail.image_url} alt="Image" style={{ width: "100%" }} />
        ) : (
          <span>No image available</span>
        )}
      </Modal>
    </div>
  );
};

export default WithdrawRequest;
