import { useEffect, useState } from "react";
import Nenkoi from "../../images/NenKoi.png";

import logo1 from "../../images/Marujyu.jpg";
import logo2 from "../../images/Marudo.jpg";
import logo3 from "../../images/Izumiya.jpg";
import logo4 from "../../images/Omosako.jpg";
import logo5 from "../../images/Dainichi.jpg";
import logo6 from "../../images/Kanno.jpg";
import logo7 from "../../images/Shinoda.jpg";
import logo8 from "../../images/Torazo.jpg";
import logo9 from "../../images/Maruhiro.jpg";
import logo10 from "../../images/Isa.jpg";
import logo11 from "../../images/Sakai.jpg";
import logo12 from "../../images/Marushin.jpg";
import logo13 from "../../images/NND.jpg";
import logo14 from "../../images/Shintaro.jpg";

import "./HomePage.css";

const HomePage = () => {
  const logos = [
    logo13,
    logo12,
    logo11,
    logo10,
    logo9,
    logo8,
    logo7,
    logo6,
    logo5,
    logo4,
    logo3,
    logo2,
    logo1,
    logo14,
  ];

  return (
    <div className="homepage">
      <section className="banner">
        <img src={Nenkoi} alt="Auction Koi Banner" />
      </section>

      <section className="content-section">
        <div className="content">
          <h1>Welcome to Auction Koi</h1>
          <p>
            AuctionKoi.com is proud to be your premier destination for Japanese
            Koi auctions in the United States...
          </p>
        </div>
      </section>

      <section className="slider-section">
        <div className="slider-background"></div>
        <div className="slider-text">
          <h1>Why should you use our website?</h1>
          <p>
            Welcome to our premier Koi auction website! Here, you'll find unique
            Japanese Koi of the highest quality from renowned breeders. Join now
            for a chance to own the finest Koi at the best prices, with an easy
            bidding process and an exceptional shopping experience!
          </p>
        </div>

        <div className="image-container">
          <div className="logo-grid">
            {logos.map((logo, index) => (
              <div key={index} className="logo-item">
                <img src={logo} alt={`Logo ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
