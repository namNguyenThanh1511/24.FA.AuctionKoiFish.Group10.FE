import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Typography,
  Tag,
} from "antd";
import api from "../../../config/axios";
import "./index.css"; // Ensure you have corresponding styles
import formatToVND from "../../../utils/currency";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const ManageAuctionSessionManager = () => {
  const [auctionSessions, setAuctionSessions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [form] = Form.useForm();
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const roleEnum = useSelector((state) => state.user.roleEnum);
  const navigate = useNavigate();

  const statusColors = {
    UPCOMING: "blue",
    ONGOING: "green",
    COMPLETED: "gold",
    CANCELLED: "red",
    NO_WINNER: "volcano",
    DRAWN: "purple",
    WAITING_FOR_PAYMENT: "orange",
  };

  useEffect(() => {
    if (roleEnum !== "MANAGER") {
      message.error("You do not have permission to access this page.");
      navigate("/");
      return;
    }

    fetchAuctionSessions();
  }, [roleEnum, navigate]);
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctionSessions((prevSessions) =>
        prevSessions.map((session) => ({
          ...session,
          timeLeft: calculateTimeLeft(
            session.auctionStatus === "UPCOMING"
              ? session.startDate
              : session.endDate
          ),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionSessions]);

  const fetchAuctionSessions = async () => {
    try {
      const response = await api.get("/auctionSession");
      const sessionsWithTimeLeft = response.data.map((session) => ({
        ...session,
        timeLeft: calculateTimeLeft(
          session.auctionStatus === "UPCOMING"
            ? session.startDate
            : session.endDate
        ),
      }));
      setAuctionSessions(sessionsWithTimeLeft);
    } catch (error) {
      message.error("Failed to fetch auction sessions");
    }
  };

  const calculateTimeLeft = (targetDate) => {
    // Parse the targetDate to a proper date object using dayjs
    const target = dayjs(targetDate);
    const now = dayjs(); // Get the current time

    // Calculate the difference in seconds
    const totalSeconds = Math.max(0, target.diff(now, "second"));

    // Convert total seconds to hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return { hours, minutes, seconds };
  };
  const handleCancelSession = async (sessionId) => {
    try {
      await api.delete(`/auctionSessions/${sessionId}`);
      message.success("Auction session cancelled successfully");
      fetchAuctionSessions();
    } catch (error) {
      message.error("Failed to cancel auction session");
    }
  };

  const showUpdateModal = (session) => {
    setCurrentSession(session);
    form.setFieldsValue({
      title: session.title,
      startingPrice: session.startingPrice,
      buyNowPrice: session.buyNowPrice,
      bidIncrement: session.bidIncrement,
      minBalanceToJoin: session.minBalanceToJoin,
    });
    setIsModalVisible(true);
  };

  const handleUpdateSession = async (values) => {
    try {
      await api.put(
        `/auctionSessions/${currentSession.auctionSessionId}`,
        values
      );
      message.success("Auction session updated successfully");
      setIsModalVisible(false);
      fetchAuctionSessions();
    } catch (error) {
      message.error("Failed to update auction session");
    }
  };

  const showDetailsModal = (session) => {
    setCurrentSession(session);
    setIsDetailsVisible(true);
  };

  const handleDetailsClose = () => {
    setIsDetailsVisible(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        margin: "100px auto",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
        Manage Auction Sessions
      </Title>
      <Row gutter={16} justify="center">
        {auctionSessions.map((session) => (
          <Col
            style={{ margin: "10px 0" }}
            key={session.auctionSessionId}
            xs={24}
            sm={12}
            md={8}
            lg={6}
          >
            <Card
              title={<strong>{session.title}</strong>}
              style={{
                width: "300px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "0.3s",
                textAlign: "center",
                height: "100%",
              }}
              hoverable
              cover={
                <img
                  alt={session.koi.name}
                  src={session.koi.image_url}
                  style={{
                    borderRadius: "12px 12px 0 0",
                    height: "200px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              }
            >
              <p>
                <Text strong>Current Price:</Text>{" "}
                {formatToVND(session.currentPrice)}
              </p>
              {session.auctionStatus === "UPCOMING" ? (
                <p>
                  <Text strong>Time left until start:</Text>
                  <span style={{ color: "blue" }}>
                    {session.timeLeft.hours}h {session.timeLeft.minutes}m{" "}
                    {session.timeLeft.seconds}s
                  </span>
                </p>
              ) : (
                <p>
                  <Text strong>Time left until end:</Text>
                  <span style={{ color: "red" }}>
                    {session.timeLeft.hours}h {session.timeLeft.minutes}m{" "}
                    {session.timeLeft.seconds}s
                  </span>
                </p>
              )}

              <p>
                <Tag color={statusColors[session.auctionStatus]}>
                  {session.auctionStatus.replace(/_/g, " ")}
                </Tag>
              </p>
              {session.auctionStatus === "UPCOMING" && (
                <Button
                  type="primary"
                  onClick={() => showUpdateModal(session)}
                  style={{ width: "48%", marginRight: "4%" }}
                >
                  Update
                </Button>
              )}
              {session.auctionStatus === "ONGOING" && (
                <Button
                  type="danger"
                  onClick={() => handleCancelSession(session.auctionSessionId)}
                  style={{ width: "48%" }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="default"
                onClick={() => showDetailsModal(session)}
                style={{ width: "48%", marginTop: "8px" }}
              >
                View Details
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Update Modal */}
      <Modal
        title="Update Auction Session"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateSession} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="startingPrice"
            label="Starting Price"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="buyNowPrice"
            label="Buy Now Price"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="bidIncrement"
            label="Bid Increment"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="minBalanceToJoin"
            label="Minimum Balance to Join"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal
        title="Auction Session Details"
        visible={isDetailsVisible}
        onCancel={handleDetailsClose}
        footer={null}
        width={800}
      >
        {currentSession && (
          <div style={{ padding: "20px" }}>
            <Title level={4}>{currentSession.koi.name}</Title>
            <img
              src={currentSession.koi.image_url}
              alt={currentSession.koi.name}
              style={{
                width: "100%",
                borderRadius: "12px",
                height: "auto",
                marginBottom: "20px",
              }}
            />
            <p>
              <Text strong>Variety:</Text>{" "}
              {currentSession.koi.varieties.map((variety) => (
                <div key={variety.name}>{variety.name}</div>
              ))}
            </p>
            <p>
              <Text strong>Starting Bid:</Text> ${currentSession.startingPrice}
            </p>
            <p>
              <Text strong>Current Price:</Text> ${currentSession.currentPrice}
            </p>
            <p>
              <Text strong>Buy Now Price:</Text> ${currentSession.buyNowPrice}
            </p>
            <p>
              <Text strong>Auction Type:</Text> {currentSession.auctionType}
            </p>
            <p>
              <Text strong>Auction Status:</Text> {currentSession.auctionStatus}
            </p>
            <p>
              <Text strong>Start Date:</Text>{" "}
              {new Date(currentSession.startDate).toLocaleString()}
            </p>
            <p>
              <Text strong>End Date:</Text>{" "}
              {new Date(currentSession.endDate).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageAuctionSessionManager;
