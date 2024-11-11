import React, { useEffect, useState } from "react";
import { Table, Tag, message, Button, Modal, Input } from "antd";
import api from "../../../config/axios";
import dayjs from "dayjs";

const AssignedAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchAssignedAuctions(pagination.current, pagination.pageSize);
  }, []);

  const fetchAssignedAuctions = async (page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const response = await api.get("/auctionSession/current-staff", {
        params: { page: page - 1, size: pageSize },
      });
      const { auctionSessionResponses, totalElements, pageNumber } =
        response.data;
      setAuctions(auctionSessionResponses);
      setPagination({
        current: pageNumber + 1,
        pageSize,
        total: totalElements,
      });
    } catch (error) {
      message.error("Failed to load assigned auctions");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (id, type) => {
    setSelectedAuctionId(id);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAuctionId(null);
    setNote("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedAuctionId) return;

    let apiEndpoint = "";
    if (modalType === "delivering") {
      apiEndpoint = `/auctionSession/markDelivering/${selectedAuctionId}`;
    } else if (modalType === "delivered") {
      apiEndpoint = `/auctionSession/markDelivered/${selectedAuctionId}`;
    } else if (modalType === "cancel") {
      apiEndpoint = `/auctionSession/markDeliveryCancelled/${selectedAuctionId}`;
    } else if (modalType === "returned") {
      apiEndpoint = `/auctionSession/markKoiFishAsReturned/${selectedAuctionId}`;
    }

    try {
      await api.put(apiEndpoint, { note });

      fetchAssignedAuctions(pagination.current, pagination.pageSize);
      closeModal();
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const isCompletedStatus = (status) => {
    return status === "COMPLETED" || status === "COMPLETED_WITH_BUYNOW";
  };

  const columns = [
    {
      title: "Auction ID",
      dataIndex: "auctionSessionId",
      key: "auctionSessionId",
    },
    {
      title: "Auction Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Starting Price (VND)",
      dataIndex: "startingPrice",
      key: "startingPrice",
      render: (price) => price.toLocaleString(),
    },
    {
      title: "Current Price (VND)",
      dataIndex: "currentPrice",
      key: "currentPrice",
      render: (price) => price.toLocaleString(),
    },
    {
      title: "Buy Now Price (VND)",
      dataIndex: "buyNowPrice",
      key: "buyNowPrice",
      render: (price) => price.toLocaleString(),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Auction Status",
      dataIndex: "auctionStatus",
      key: "auctionStatus",
      render: (status) => (
        <Tag color={isCompletedStatus(status) ? "green" : "orange"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      render: (status) => {
        let color = "default";
        if (status === "DELIVERING") {
          color = "orange";
        } else if (status === "DELIVERED") {
          color = "green";
        } else if (status === "DELIVERED_CANCELLED") {
          color = "red";
        }

        return status ? (
          <Tag color={color}>{status}</Tag>
        ) : (
          <Tag color="red">Pending</Tag>
        );
      },
    },
    {
      title: "Edit Delivery Status",
      key: "editDeliveryStatus",
      render: (_, record) => {
        if (isCompletedStatus(record.auctionStatus)) {
          const buttonStyle = { width: "100%" }; // Đảm bảo các nút có chiều rộng bằng nhau

          if (record.deliveryStatus === null) {
            return (
              <Button
                type="primary"
                onClick={() => openModal(record.auctionSessionId, "delivering")}
                style={buttonStyle}
              >
                Mark Delivering
              </Button>
            );
          }

          if (record.deliveryStatus === "DELIVERING") {
            return (
              <>
                <Button
                  type="primary"
                  onClick={() =>
                    openModal(record.auctionSessionId, "delivered")
                  }
                  style={{ ...buttonStyle, marginBottom: "10px" }} // Margin giữa các nút
                >
                  Mark Delivered
                </Button>
                <Button
                  danger
                  onClick={() => openModal(record.auctionSessionId, "cancel")}
                  style={buttonStyle}
                >
                  Cancel Delivery
                </Button>
              </>
            );
          }

          if (
            record.deliveryStatus === "DELIVERED_CANCELLED" &&
            record.koi.koiStatus !== "AVAILABLE"
          ) {
            return (
              <Button
                danger
                onClick={() => openModal(record.auctionSessionId, "returned")}
                style={buttonStyle}
              >
                Returned to Koi_Breeder
              </Button>
            );
          }

          // Disable button when deliveryStatus is DELIVERED_CANCELLED and koi.koiStatus is AVAILABLE
          if (
            record.deliveryStatus === "DELIVERED_CANCELLED" &&
            record.koi.koiStatus === "AVAILABLE"
          ) {
            return (
              <Button type="primary" disabled style={buttonStyle}>
                Returned to Koi_Breeder
              </Button>
            );
          }
        }
        return <Tag color="default">Not Editable</Tag>;
      },
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchAssignedAuctions(pagination.current, pagination.pageSize);
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2 style={{ textAlign: "center" }}>Assigned Auctions</h2>
      <Table
        dataSource={auctions}
        columns={columns}
        rowKey="auctionSessionId"
        loading={loading}
        onChange={handleTableChange}
        pagination={pagination}
      />

      {/* Modal để nhập ghi chú */}
      <Modal
        title={
          modalType === "delivering"
            ? "Mark as Delivering"
            : modalType === "delivered"
            ? "Mark as Delivered"
            : modalType === "cancel"
            ? "Cancel Delivery"
            : "Mark as Returned"
        }
        open={isModalOpen}
        onOk={handleUpdateStatus}
        onCancel={closeModal}
        okText="Submit"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default AssignedAuctions;
