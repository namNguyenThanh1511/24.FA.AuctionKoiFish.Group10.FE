import { Button, Card, Tag, Image, Spin, Alert } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import dayjs from "dayjs";
import formatToVND from "../../utils/currency";

function CardKoiFish({ id }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    if (!id) return; // Do not fetch if no id is passed
    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await api.get(`/koiFish/${id}`);
      setData(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch koi fish details.");
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  if (!id) {
    return <Alert message="No Koi Fish ID provided." type="warning" />;
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Spin tip="Loading koi fish details..." />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "yellow";
      case "ACCEPTED":
        return "green";
      case "REJECTED":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <Card style={{ width: 300, marginTop: 16 }}>
      <div style={{ textAlign: "center" }}>
        <Image width={100} src={data?.image_url} />
        <div style={{ marginTop: 16 }}>
          <Tag color="geekblue">{data?.name}</Tag>
          <Tag color="volcano">{data?.sex}</Tag>
        </div>
        <p style={{ marginTop: 8 }}>
          <strong>Koi ID:</strong> {data?.koi_id}
        </p>
        <p>
          <strong>Size:</strong> {data?.sizeCm} cm
        </p>
        <p>
          <strong>Weight:</strong> {data?.weightKg} kg
        </p>
        <p>
          <strong>Born In:</strong> {dayjs(data?.bornIn).format("YYYY-MM-DD")}
        </p>
        <p>
          <strong>Description:</strong> {data?.description}
        </p>
        <p>
          <strong>Estimated Value:</strong> {formatToVND(data?.estimatedValue)}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <Tag color={getStatusColor(data?.koiStatus)}>{data?.koiStatus}</Tag>
        </p>
        {data?.video_url && (
          <p>
            <strong>Video:</strong>{" "}
            <a href={data?.video_url} target="_blank" rel="noopener noreferrer">
              Watch Video
            </a>
          </p>
        )}
      </div>
    </Card>
  );
}

export default CardKoiFish;
