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
              Koi Auction Vietnam is your premier destination for quality Koi fish auctions in Vietnam. We are dedicated to connecting Koi enthusiasts with top-quality Koi bred locally.
            </p>
            <p>Address: 123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam</p>
            <p>TEL: +84 908 123 456</p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@KoiAuctionVN.com"
                className="footer-link"
              >
                info@KoiAuctionVN.com
              </a>
            </p>
            <p>
              Support:{" "}
              <a
                href="mailto:support@KoiAuctionVN.com"
                className="footer-link"
              >
                support@KoiAuctionVN.com
              </a>
            </p>
          </div>
        </div>

        <div className="footer-hours">
          <h3>Hours of Operation</h3>
          <p>Monday – Friday: 8:00 a.m. to 5:00 p.m. ICT</p>
          <p>Saturday: 8:00 a.m. to 12:00 p.m. ICT</p>
          <p>Sunday Closed</p>
        </div>

        <div className="footer-links">
          <h3>Visit Our Showroom</h3>
          <ul>
            <li>
              <a href="/hochiminh" className="footer-link">
                Koi Auction Vietnam in Ho Chi Minh City
              </a>
            </li>
            <li>
              <a href="/hanoi" className="footer-link">
                Koi Auction Vietnam in Hanoi
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-payment">
          <h3>Payment Methods</h3>
          <img src={VNPay} alt="VNPay" />
          
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Koi Auction Vietnam. All rights reserved.</p>
        <p>
          Terms of Service | Privacy Policy
        </p>
      </div>
    </footer>
  );
};

export default Footer;
