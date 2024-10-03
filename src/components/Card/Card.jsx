import React from "react";
import "./Card.css";

const Card = ({
  image,
  title,
  id,
  breeder,
  length,
  sex,
  age,
  stars,
  price,
  time, // Sử dụng lại biến time thay vì endTime
  likes,
  variety,
}) => {
  // Hàm tính thời gian còn lại
  const calculateTimeLeft = (timeString) => {
    const auctionEndTime = new Date(timeString).getTime();
    const currentTime = new Date().getTime();
    const difference = auctionEndTime - currentTime;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft;
  };

  // Lấy thời gian còn lại từ hàm
  const timeLeft = calculateTimeLeft(time);

  return (
    <div className="card-container">
      <div className="card-header">
        <img src={image} alt="koi fish" className="card-image" />
        <div className="card-likes">
          <span>{likes}</span>
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-id">{id}</p>
        <div className="card-time-left">
          <p>Time left</p>
          <div className="time-left">
            <div className="time-unit">
              <span className="time-value">{timeLeft.days}</span>
              <span className="time-label">Days</span>
            </div>
            <div className="time-unit">
              <span className="time-value">{timeLeft.hours}</span>
              <span className="time-label">Hours</span>
            </div>
            <div className="time-unit">
              <span className="time-value">{timeLeft.minutes}</span>
              <span className="time-label">Minutes</span>
            </div>
            <div className="time-unit">
              <span className="time-value">{timeLeft.seconds}</span>
              <span className="time-label">Seconds</span>
            </div>
          </div>
        </div>

        <div className="card-rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={`star ${index < stars ? "filled" : ""}`}
            >
              ★
            </span>
          ))}
        </div>
        <div className="card-price">${price}</div>
        <div className="card-info">
          <p>
            <strong>Breeder: </strong>
            {breeder}
          </p>
          <p>
            <strong>Length: </strong>
            {length}cm
          </p>
          <p>
            <strong>Sex: </strong>
            {sex}
          </p>
          <p>
            <strong>Age: </strong>
            {age}
          </p>
          <p>
            <strong>Variety: </strong>
            {variety}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
