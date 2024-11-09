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
  const [varietiesList, setVarietiesList] = useState([]);
  const [breedersList, setBreedersList] = useState([]);
  const [searchParams, setSearchParams] = useState({
    
    breederName: "",
    varieties: null,
    minSizeCm: null,
    maxSizeCm: null,
    minWeightKg: null, // Thêm thuộc tính cho trọng lượng tối thiểu
    maxWeightKg: null, // Thêm thuộc tính cho trọng lượng tối đa
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
  const fetchVarieties = async () => {
    try {
      const response = await api.get(`/variety/all`);
      setVarietiesList(response.data);
    } catch (error) {
      console.log("Error fetching varieties:", error);
    }
  };

  const fetchBreeders = async () => {
    try {
      const response = await api.get(`/breederSimplified`);
      setBreedersList(response.data);
    } catch (error) {
      console.log("Error fetching breeders:", error);
    }
  };
  
  
  // Gọi hàm fetchVarieties khi component được mount


  useEffect(() => {
    fetchVarieties();
    fetchBreeders(); // Gọi API lấy danh sách breeder
  }, []);
  
  

  const fetchKoiFish = async (page, params = {}) => {
    try {
      // Kiểm tra nếu tất cả các tham số tìm kiếm đều trống
      const isEmptyFilter = Object.values(params).every(
        (value) => value === null || value === ""
      );
  
      const filteredParams = { ...params };
      if (!filteredParams.breederName) delete filteredParams.breederName;
      if (!filteredParams.minSizeCm) delete filteredParams.minSizeCm;
      if (!filteredParams.maxSizeCm) delete filteredParams.maxSizeCm;
      if (!filteredParams.minWeightKg) delete filteredParams.minWeightKg;
      if (!filteredParams.maxWeightKg) delete filteredParams.maxWeightKg;
      if (!filteredParams.varieties) delete filteredParams.varieties;
      if (!filteredParams.sex) delete filteredParams.sex;
      if (!filteredParams.auctionType) delete filteredParams.auctionType;
      if (!filteredParams.status) delete filteredParams.status;
  
      const response = await api.get(`/auctionSession/search`, {
        params: {
          ...(isEmptyFilter ? {} : filteredParams), // Truyền params nếu có bộ lọc
          page: page,
          size: cardsPerPage,
        },
      });
  
      const data = response.data.auctionSessionResponses;
      const totalPages = response.data.totalPages;
  
      const transformedData = data.map((item) => ({
        auctionSessionId: item.auctionSessionId,
        name: item.koi.name || "Unknown",
        title: item.title || "Unknown",
        breeder: item.koi.breeder.username || "Unknown",
        size: item.koi.sizeCm || "Unknown",
        weight: item.koi.weightKg || "Unknown",
        sex: item.koi.sex || "Unknown",
        age: calculateAge(item.koi.bornIn),
        price: item.currentPrice || 0,
        variety: item.koi.varieties.map((v) => v.name).join(", ") || "Unknown",
        image: item.koi.image_url || "",
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        auctionStatus: item.auctionStatus || "Unknown",
        auctionType: item.auctionType || "Unknown",
      }));
  
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
    } else if (name === "weightRange") {
      setSearchParams((prev) => ({
        ...prev,
        minWeightKg: value.minWeightKg === 0 ? null : value.minWeightKg,
        maxWeightKg: value.maxWeightKg === 0 ? null : value.maxWeightKg,
      }));
    } else {
      setSearchParams((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchKoiFish(0, searchParams); // Gọi lại API với tham số mới
    setCurrentPage(0);
  };
  
  

  return (
    <div className="auction-form-container">
      <form className="search-form" onSubmit={handleFilterSubmit}>
        <div className="search-row">
        <Select
        allowClear
  className="custom-select select-breeder"
  placeholder="Select Breeder"
  onChange={(value) => handleInputChange("breederName", value)}
>
  {breedersList.map((breeder) => (
    <Option key={breeder.id} value={breeder.username}>
      {breeder.username}
    </Option>
  ))}
</Select>

<Select
allowClear
  className="custom-select select-varieties"
  mode="multiple"
  placeholder="Select Varieties"
  onChange={(values) => handleInputChange("varieties", values)}
>
  {varietiesList.map((variety) => (
    <Option key={variety.id} value={variety.name}>
      {variety.name}
    </Option>
  ))}
</Select>


          <Select
          allowClear
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
          allowClear
            placeholder="Select Sex"
            onChange={(value) => handleInputChange("sex", value)}
          >
            <Option value="MALE">Male</Option>
            <Option value="FEMALE">Female</Option>
          </Select>

          <Select
  className="select-status"
  allowClear
  placeholder="Select Status"
  onChange={(value) => handleInputChange("status", value)}
>
  <Option value="UPCOMING">Upcoming</Option>
  <Option value="ONGOING">Ongoing</Option>
  <Option value="NO_WINNER">No winner</Option>
  <Option value="COMPLETED">Completed</Option>
  <Option value="COMPLETED_WITH_BUYNOW">Completed by Buy Now</Option>
  <Option value="DRAWN">Drawn</Option>
</Select>

<div className="custom-slider">
  <label>Size (cm):</label>
  <Slider
    range
    min={0}
    max={100}
    marks={{
      0: "0 cm",
      50: "50 cm",
      100: "100 cm",
    }}
    onChange={(value) =>
      handleInputChange("sizeRange", {
        minSizeCm: value[0],
        maxSizeCm: value[1],
      })
    }
    tooltip={{ formatter: (value) => `${value} cm` }}
  />
</div>

<div className="custom-slider">
  <label>Weight (kg):</label>
  <Slider
    range
    min={0}
    max={100}
    step={0.1}
    marks={{
      0: "0 kg",
      50: "50 kg",
      100: "100 kg",
    }}
    onChange={(value) =>
      handleInputChange("weightRange", {
        minWeightKg: value[0],
        maxWeightKg: value[1],
      })
    }
    tooltip={{ formatter: (value) => `${value} kg` }}
  />
</div>


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
            size={card.size}
            weight={card.weight}
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
