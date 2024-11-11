import React, { useState, useEffect } from "react";
import HeaderLogin from "../../components/header-logged-in";
import "./Auction.css";
import { Button, Modal, Input, Select, InputNumber } from "antd";
import Card from "../../components/Card/Card";
import Koi from "../../images/Koi1.jpg";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import useRealtime from "../../hooks/useRealTime";

const { Option } = Select;

const Auction = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsData, setCardsData] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    breederName: "",
    varieties: null,
    minSizeCm: null,
    maxSizeCm: null,
    minWeightKg: null,
    maxWeightKg: null,
    sex: null, // Thêm thuộc tính sex
    auctionType: null, // Thêm thuộc tính auctionType
    status: null,
  });
  const cardsPerPage = 8;
  const navigate = useNavigate();

  const calculateAge = (dateOfBirth) => {
    const now = new Date();
    const birthDate = new Date(dateOfBirth);
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years ${months} months`;
  };

  const fetchKoiFish = async (page, params = {}) => {
    try {
      const filteredParams = { ...params };
      if (!filteredParams.breederName) {
        delete filteredParams.breederName;
      }

      const response = await api.get(`/auctionSession/search`, {
        params: {
          ...filteredParams,
          page: page,
          size: cardsPerPage,
        },
      });
      console.log("Data fetched from API:", response.data); // In dữ liệu ra console

      const data = response.data.auctionSessionResponses;
      const totalPages = response.data.totalPages;

      const transformedData = data.map((item) => {
        const age = calculateAge(item.koi.bornIn);
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const countdown = getCountdown(startDate, endDate, item.auctionStatus);

        return {
          auctionSessionId: item.auctionSessionId,
          name: item.koi.name || "Unknown",
          title: item.title || "Unknown",
          breeder: item.koi.breeder.username || "Unknown",
          size: item.koi.sizeCm || "Unknown",
          weight: item.koi.weightKg || "Unknown",
          sex: item.koi.sex || "Unknown",
          bornIn: item.koi.bornIn || "Unknown",
          age: age || "0 years 0 months",
          price: item.currentPrice || 0,
          variety: item.koi.varieties.map((v) => v.name).join(", ") || "Unknown",
          image: item.koi.image_url || "",
          startDate: startDate,
          endDate: endDate,
          countdown: countdown,
          auctionStatus: item.auctionStatus || "Unknown",
          auctionType: item.auctionType || "Unknown",
        };
      });

      setCardsData(transformedData);
      setTotalPages(totalPages);
    } catch (error) {
      console.log("Detailed error information:", error);
      alert("There was an error fetching data. Please try again.");
    }
  };

  useEffect(() => {
    fetchKoiFish(currentPage, searchParams);
  }, [currentPage, searchParams]);

  const getCountdown = (startDate, endDate, auctionStatus) => {
    if (auctionStatus === "COMPLETED") return "Auction ended";
    const offset = 7 * 3600 * 1000;
    let totalSeconds;
    if (auctionStatus === "UPCOMING") {
      totalSeconds = Math.floor((startDate - Date.now() - offset) / 1000);
    } else {
      totalSeconds = Math.floor((endDate - Date.now() - offset) / 1000);
    }
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return totalSeconds > 0 ? `${days}d ${hours}h ${minutes}m ${seconds}s` : "Auction ended";
  };

  const handleSearchClick = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    fetchKoiFish(0, searchParams);
    setCurrentPage(0);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (name, value) => {
    if (name === "varieties") {
      const varietiesString = value.join(", ");
      setSearchParams((prev) => ({ ...prev, [name]: varietiesString }));
    } else {
      setSearchParams((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePageChange = (pageNumber) => {
    console.log(pageNumber);
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useRealtime((body) => {
    if (body.body.trim() === "CREATED NEW AUCTION SESSION".trim()) {
      fetchKoiFish(currentPage, searchParams);
    }
  });

  return (
    <div className="auction-form-container">
      <Button type="primary" onClick={handleSearchClick}>
        Search
      </Button>

      <Modal
        title="Search Filters"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Select
          style={{ width: "100%", marginTop: 10 }}
          placeholder="Select Breeder"
          onChange={(value) => handleInputChange("breederName", value)}
        >
          <Option value="NND">NND</Option>
          <Option value="Sakai">Sakai</Option>
          <Option value="Marushin">Marushin</Option>
          <Option value="Isa">Isa</Option>
          <Option value="Maruhiro">Maruhiro</Option>
          <Option value="Torazo">Torazo</Option>
          <Option value="Shinoda">Shinoda</Option>
          <Option value="Kanno">Kanno</Option>
          <Option value="Dainichi">Dainichi</Option>
          <Option value="Omosako">Omosako</Option>
          <Option value="Izumiya">Izumiya</Option>
          <Option value="Marudo">Marudo</Option>
          <Option value="Marujyu">Marujyu</Option>
          <Option value="Shintaro">Shintaro</Option>
          <Option value="koibreeder1">koibreeder1</Option>
        </Select>
        <Select
          mode="multiple"
          style={{ width: "100%", marginTop: 10 }}
          placeholder="Varieties"
          onChange={(values) => handleInputChange("varieties", values)}
        >
          <Option value="Kohaku">Kohaku</Option>
          <Option value="Showa">Showa</Option>
          <Option value="Tancho">Tancho</Option>
        </Select>
        <InputNumber
          placeholder="Min Size (cm)"
          value={searchParams.minSizeCm}
          onChange={(value) => handleInputChange("minSizeCm", value)}
          style={{ width: "100%", marginTop: 10 }}
        />
        <InputNumber
          placeholder="Max Size (cm)"
          value={searchParams.maxSizeCm}
          onChange={(value) => handleInputChange("maxSizeCm", value)}
          style={{ width: "100%", marginTop: 10 }}
        />
        <InputNumber
          placeholder="Min Weight (kg)"
          value={searchParams.minWeightKg}
          onChange={(value) => handleInputChange("minWeightKg", value)}
          style={{ width: "100%", marginTop: 10 }}
        />
        <InputNumber
          placeholder="Max Weight (kg)"
          value={searchParams.maxWeightKg}
          onChange={(value) => handleInputChange("maxWeightKg", value)}
          style={{ width: "100%", marginTop: 10 }}
        />

        {/* Thêm Dropdown cho sex */}
        <Select
          style={{ width: "100%", marginTop: 10 }}
          placeholder="Select Sex"
          onChange={(value) => handleInputChange("sex", value)}
        >
          <Option value="MALE">Male</Option>
          <Option value="FEMALE">Female</Option>
        </Select>

        {/* Thêm Dropdown cho auctionType */}
        <Select
          style={{ width: "100%", marginTop: 10 }}
          placeholder="Select Auction Type"
          onChange={(value) => handleInputChange("auctionType", value)}
        >
          <Option value="ASCENDING">Ascending</Option>
          <Option value="DESCENDING">Descending</Option>
        </Select>
        <Select
          style={{ width: "100%", marginTop: 10 }}
          placeholder="Select status"
          onChange={(value) => handleInputChange("status", value)}
        >
          <Option value="UPCOMING">Upcoming</Option>
          <Option value="ONGOING">On-going</Option>
          <Option value="NO_WINNER">No winner</Option>
          <Option value="COMPLETED">Completed</Option>
          <Option value="COMPLETED_WITH_BUYNOW">Completed by buy now</Option>
          <Option value="DRAWN">DRAWN</Option>
        </Select>
      </Modal>

      <div className="card-grid">
        {cardsData.map((card) => (
          <Card
            key={card.auctionSessionId}
            image={card.image || Koi}
            title={card.title}
            name={card.name}
            breeder={card.breeder}
            size={card.size}
            weight={card.weight}
            sex={card.sex}
            age={card.age}
            countdown={card.countdown}
            price={card.price.toLocaleString("en-US")}
            variety={card.variety}
            auctionStatus={card.auctionStatus}
            auctionType={card.auctionType}
            auctionSessionId={card.auctionSessionId}
            onViewClick={() => {
              navigate(`${card.auctionSessionId}`, { replace: true });
            }}
          />
        ))}
      </div>
      <div className="pagination">
        <Button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          {"<"}
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            className="pagination-button"
            onClick={() => handlePageChange(index)}
            disabled={currentPage === index}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          {">"}
        </Button>
      </div>
    </div>
  );
};

export default Auction;
