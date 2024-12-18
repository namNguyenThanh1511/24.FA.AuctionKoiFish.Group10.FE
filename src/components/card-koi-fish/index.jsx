import { Button, Card, Tag, Image, Spin, Alert } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import dayjs from "dayjs";
import formatToVND from "../../utils/currency";

function CardKoiFish({ id }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const varietyColorMap = {
    Kohaku: "red",
    Sowa: "lime",
    Ochibashigure: "magenta",
    Hirenaga: "gold",
    Tancho: "purple",
    Kiryuu: "orange",
    Sanke: "volcano",
    Showa: "green",
    Utsurimono: "blue",
    Bekko: "cyan",
    Asagi: "geekblue",
    Shusui: "purple",
  };

  const fetch = async () => {
    if (!id) return;
    setLoading(true);
    setError(null); 

    try {
      const response = await api.get(`/koiFish/${id}`);
      setData(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch koi fish details.");
    } finally {
      setLoading(false); 
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
  const statusColors = {
    AVAILABLE: "green",
    PENDING: "yellow",
    PENDING_AUCTION: "orange",
    SELLING: "purple",
    DELIVER_REQUIRED: "red",
    DELIVERING_TO_BUYER: "teal",
    RETURNING: "brown",
    SOLD: "blue",
    UNAVAILABLE: "gray",
  };

  return (
    <Card style={{ width: 300 }}>
      <div style={{ textAlign: "center" }}>
        <Image width={100} src={data?.image_url} />
        <div style={{ marginTop: 16 }}>
          <Tag color="geekblue">{data?.name}</Tag>
          <Tag color="volcano">{data?.sex}</Tag>
        </div>
        <p style={{ marginTop: 8 }}>
          <strong>Koi ID :</strong> {data?.name + "#" + data?.koi_id}
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
          <Tag color={statusColors[data?.koiStatus]}>{data?.koiStatus}</Tag>
        </p>
        <span>
          <strong>Varieties :</strong>{" "}
        </span>
        {/* Display Koi Varieties as Tags */}
        {data?.varieties?.map((variety, id) => {
          

          const color = varietyColorMap[variety.name] || "gray";

          return (
            <Tag color={color} key={id} style={{ margin: "4px" }}>
              {variety.name}
            </Tag>
          );
        })}

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
