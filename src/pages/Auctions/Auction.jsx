import React, { useState, useEffect } from "react";
import HeaderLogin from "../../components/header-logged-in";
import "./Auction.css";
import { Button, InputNumber, Select, Slider } from "antd";
import Card from "../../components/Card/Card";
import Koi from "../../images/Koi1.jpg";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const Auction = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsData, setCardsData] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [totalPages, setTotalPages] = useState();
  const [searchParams, setSearchParams] = useState({
    breederName: "",
    varieties: null,
    minSizeCm: null,
    maxSizeCm: null,
    sex: null,
    auctionType: null,
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
      if (!filteredParams.breederName) delete filteredParams.breederName;
      if (!filteredParams.minSizeCm) delete filteredParams.minSizeCm;
      if (!filteredParams.maxSizeCm) delete filteredParams.maxSizeCm;

      const response = await api.get(`/auctionSession/search`, {
        params: {
          ...filteredParams,
          page: page,
          size: cardsPerPage,
        },
      });
      console.log("Data fetched from API:", response.data);

      const data = response.data.auctionSessionResponses;
      const totalPages = response.data.totalPages;

      const transformedData = data.map((item) => {
        const age = calculateAge(item.koi.bornIn);
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        return {
          auctionSessionId: item.auctionSessionId,
          name: item.koi.name || "Unknown",
          title: item.title || "Unknown",
          breeder: item.koi.breeder.username || "Unknown",
          length: item.koi.sizeCm || "Unknown",
          sex: item.koi.sex || "Unknown",
          bornIn: item.koi.bornIn || "Unknown",
          age: age || "0 years 0 months",
          price: item.currentPrice || 0,
          variety:
            item.koi.varieties.map((v) => v.name).join(", ") || "Unknown",
          image: item.koi.image_url || "",
          startDate: startDate,
          endDate: endDate,
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
    return totalSeconds > 0
      ? `${days}d ${hours}h ${minutes}m ${seconds}s`
      : "Auction ended";
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchKoiFish(page, searchParams); // Gọi lại API để lấy dữ liệu của trang mới
    }
  };

  useEffect(() => {
    fetchKoiFish(currentPage, searchParams);
  }, [currentPage, searchParams]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCountdowns = {};
      cardsData.forEach((card) => {
        newCountdowns[card.auctionSessionId] = getCountdown(
          card.startDate,
          card.endDate,
          card.auctionStatus
        );
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [cardsData]);

  const handleInputChange = (name, value) => {
    if (name === "varieties") {
      const varietiesString = value.join(", ");
      setSearchParams((prev) => ({ ...prev, [name]: varietiesString }));
    } else if (name === "sizeRange") {
      setSearchParams((prev) => ({
        ...prev,
        minSizeCm: value.minSizeCm === 0 ? null : value.minSizeCm,
        maxSizeCm: value.maxSizeCm === 0 ? null : value.maxSizeCm,
      }));
    } else {
      setSearchParams((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchKoiFish(0, searchParams);
    setCurrentPage(0);
  };

  return (
    <div className="auction-form-container">
      <form className="search-form" onSubmit={handleFilterSubmit}>
        <div className="search-row">
          <Select
            className="select-breeder"
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
            className="select-varieties"
            mode="multiple"
            placeholder="Varieties"
            onChange={(values) => handleInputChange("varieties", values)}
          >
            <Option value="Kohaku">Kohaku</Option>
            <Option value="Showa">Showa</Option>
            <Option value="Tancho">Tancho</Option>
          </Select>
          <Select
            className="select-type"
            placeholder="Select Auction Type"
            onChange={(value) => handleInputChange("auctionType", value)}
          >
            <Option value="ASCENDING">Ascending</Option>
            <Option value="FIXED_PRICE">Fixed Price</Option>
          </Select>
        </div>

        <div className="search-row">
          <Select
            placeholder="Select Sex"
            onChange={(value) => handleInputChange("sex", value)}
          >
            <Option value="MALE">Male</Option>
            <Option value="FEMALE">Female</Option>
          </Select>
          <Select
            placeholder="Select Status"
            onChange={(value) => handleInputChange("status", value)}
          >
            <Option value="ONGOING">Ongoing</Option>
            <Option value="UPCOMING">Upcoming</Option>
            <Option value="NO_WINNER">No Winner</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
          <Slider
            range
            min={0}
            max={100}
            onChange={(value) =>
              handleInputChange("sizeRange", {
                minSizeCm: value[0],
                maxSizeCm: value[1],
              })
            }
            style={{ width: "200px" }}
            tooltip={{ formatter: (value) => `${value} cm` }}
          />
          <Button
            type="primary"
            htmlType="submit"
            className="custom-filter-button"
          >
            FILTER
          </Button>
        </div>
      </form>

      <div className="card-grid">
        {cardsData.map((card) => (
          <Card
            key={card.auctionSessionId}
            image={card.image || Koi}
            title={card.title}
            name={card.name}
            breeder={card.breeder}
            length={card.length}
            sex={card.sex}
            age={card.age}
            countdown={countdowns[card.auctionSessionId]}
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
