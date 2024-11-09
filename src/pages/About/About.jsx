import React, { useState } from "react";
import {
  DropboxOutlined,
  StockOutlined,
  PayCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "./About.css";

const faqs = [
  {
    question: "How do Koi auctions in Vietnam work?",
    answer: `Koi auctions in Vietnam are events where reputable local breeders showcase and sell their highest quality Koi fish. 
    These auctions are held online, allowing Koi enthusiasts to participate from anywhere. We partner with major Koi farms such as Hai Thanh, Nhat Anh, and Koi Land, ensuring all fish have clear origins and are well cared for.`,
  },
  {
    question: "How do in-house auctions work?",
    answer: `In-house auctions are exclusive events hosted on our platform, designed for the Koi community in Vietnam. Participants can acquire unique Koi fish from breeders we have carefully selected for their expertise and fish quality. Auctions are conducted both live and online, so you can easily participate no matter where you are.`,
  },
  {
    question: "How does shipping work and what are the costs?",
    answer: `We take great care in ensuring that each Koi fish is shipped in optimal condition. Special shipping containers are used to provide sufficient oxygen and clean water during transport. Shipping costs are calculated based on distance and the size of the Koi, typically ranging from 500,000 VND to 1,500,000 VND for domestic orders. For distant provinces, shipping fees may be higher.`,
  },
  {
    question: "What happens if my Koi fish dies during transit?",
    answer: `While we take every precaution to ensure your Koi fish arrives safely, there are rare cases where a fish may not survive transit. In such cases, we will either replace the fish or provide a refund if a replacement is not available. Please document the condition of the Koi upon arrival with photos and report any issues to us immediately.`,
  },
  {
    question: "When are payments due after winning an auction?",
    answer: `Payments must be completed within 48 hours of winning an auction. We accept various payment methods, including bank cards, e-wallets like Momo and ZaloPay, and direct bank transfers. Once your payment is confirmed, we will arrange shipping and provide tracking information.`,
  },
  {
    question: "How long does it take to receive my Koi fish?",
    answer: `Shipping times vary depending on your location and weather conditions. After receiving payment, we typically require 3-5 business days to prepare the Koi for shipment. For orders in Northern and Central Vietnam, delivery usually takes 5-7 business days.`,
  },
  {
    question: "Do you offer storage if I can't receive my Koi fish right away?",
    answer: `Yes, we provide storage services if you're not able to receive your Koi immediately. Your fish will be kept in optimal conditions at our certified facilities until you're ready to arrange delivery.`,
  },
  {
    question: "Is there bid sniping protection?",
    answer: `Yes, we have implemented bid sniping protection to ensure a fair bidding process. If a bid is placed in the final moments, the auction time will be automatically extended to allow other participants a fair chance to respond.`,
  },
  {
    question: "Can international buyers participate?",
    answer: `Absolutely! Our platform allows international buyers to participate in auctions. However, please be aware that international shipping fees and customs procedures may apply based on your location.`,
  },
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="about-container">

      <div className="blurred-background">
        <h2>Auction Legend Koi</h2>
        <p>
          KoiAuction.vn is the leading platform in Vietnam for Koi enthusiasts,
          providing online auctions from top local breeders. Our mission is to
          connect Koi lovers with reputable breeders, delivering a trustworthy
          and high-quality buying experience.
        </p>
        <p>
          With a deep passion for the art of Koi keeping, we create a fair and
          transparent playground for the Koi community. You can now join
          auctions for high-quality Koi fish from the comfort of your own home!
        </p>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question === "How do Koi auctions in Vietnam work?" && (
                <DropboxOutlined className="icon" />
              )}
              {faq.question === "How do in-house auctions work?" && (
                <StockOutlined className="icon" />
              )}
              {faq.question ===
                "How does shipping work and what are the costs?" && (
                <PayCircleOutlined className="icon" />
              )}
              {faq.question ===
                "What happens if my Koi fish dies during transit?" && (
                <SafetyCertificateOutlined className="icon" />
              )}
              {faq.question ===
                "When are payments due after winning an auction?" && (
                <ClockCircleOutlined className="icon" />
              )}
              {faq.question ===
                "How long does it take to receive my Koi fish?" && (
                <HomeOutlined className="icon" />
              )}
              {faq.question === "Is there bid sniping protection?" && (
                <SafetyCertificateOutlined className="icon" />
              )}
              {faq.question === "Can international buyers participate?" && (
                <GlobalOutlined className="icon" />
              )}
              <span>{faq.question}</span>
              <span className={`arrow ${activeIndex === index ? "open" : ""}`}>
                &#9662;
              </span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
