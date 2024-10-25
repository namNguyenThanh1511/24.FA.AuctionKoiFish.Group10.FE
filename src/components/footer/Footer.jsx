import React from "react";
import "./Footer.css";

import VNPay from "../../images/VNPay.png";
import logo from "../../images/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="footer-info">
          <div className="info-text">
            <p>
              Koi Auction Legend is the premier destination for quality Japanese
              koi fish for sale. We are the largest importer of Koi in North
              America.
            </p>
            <p>P.O. Box 893086, Mililani HI 96789</p>
            <p>TEL: +1 (833) Koi Love (1-833-564-5683)</p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@KoiAuctionLegend.com"
                className="footer-link"
              >
                info@KoiAuctionLegend.com
              </a>
            </p>
            <p>
              Help:{" "}
              <a
                href="mailto:help@KoiAuctionLegend.com"
                className="footer-link"
              >
                help@KoiAuctionLegend.com
              </a>
            </p>
          </div>
        </div>
        <div className="footer-hours">
          <h3>Hours of Operation</h3>
          <p>Monday – Friday: 7:00 a.m. to 3:00 p.m. HST</p>
          <p>Saturday and Sunday Closed</p>
        </div>
        <div className="footer-links">
          <h3>Visit Our Local Stores</h3>
          <ul>
            <li>
              <a href="/florida" className="footer-link">
                Koi Auction Legend in New York
              </a>
            </li>
            <li>
              <a href="/newjersey" className="footer-link">
                Koi Auction Legend in Viet Nam
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-payment">
          <h3>Payment Methods</h3>

          <img src={VNPay} alt="Momo" />
        </div>
      </div>
      <div className="footer-bottom">
        
      </div>
    </footer>
  );
};

export default Footer;
