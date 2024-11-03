import React, { useEffect, useState } from "react";
import { Table, Modal, Button, message, Tooltip } from "antd";
import api from "../../../config/axios";
import dayjs from "dayjs";

const ProcessLog = () => {
  const [processLogs, setProcessLogs] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchProcessLogData = async () => {
    try {
      const response = await api.get(`/auctionRequest/processLog`);
      console.log("Process log data fetched: ", response.data);
      setProcessLogs(response.data);
    } catch (error) {
      message.error("Failed to load process log data");
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchProcessLogData();
  }, []);

  const showDetails = (log) => {
    setSelectedLog(log);
    setIsDetailModalVisible(true);
  };

  const columns = [
    {
      title: "Log ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <Tooltip title={dayjs(date).format("MMMM D, YYYY, h:mm A")}>
          <span>{dayjs(date).format("YYYY-MM-DD HH:mm:ss")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Auction Title",
      dataIndex: ["auctionRequest", "title"],
      key: "auctionTitle",
    },
    {
      title: "Staff",
      dataIndex: ["staff", "fullName"],
      key: "staffName",
    },
    {
      title: "Manager",
      dataIndex: ["manager", "fullName"],
      key: "managerName",
    },
    {
      title: "Details",
      key: "details",
      render: (text, record) => (
        <Button type="link" onClick={() => showDetails(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "50px" }}>
      <Table dataSource={processLogs} columns={columns} rowKey="id" />

      {/* Modal hiển thị chi tiết log */}
      <Modal
        title="Process Log Details"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedLog && (
          <>
            <p>
              <strong>Log ID:</strong> {selectedLog.id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {dayjs(selectedLog.date).format("YYYY-MM-DD HH:mm:ss")}
            </p>
            <p>
              <strong>Status:</strong> {selectedLog.status}
            </p>
            <p>
              <strong>Auction Title:</strong> {selectedLog.auctionRequest.title}
            </p>
            <p>
              <strong>Created Date:</strong>{" "}
              {dayjs(selectedLog.auctionRequest.createdDate).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
            </p>
            <p>
              <strong>Breeder:</strong>{" "}
              {selectedLog.auctionRequest.breeder.username}
            </p>
            <p>
              <strong>Staff Name:</strong>{" "}
              {selectedLog.staff?.fullName || "Null"}
            </p>
            <p>
              <strong>Manager Name:</strong>{" "}
              {selectedLog.manager?.fullName || "Null"}
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProcessLog;
