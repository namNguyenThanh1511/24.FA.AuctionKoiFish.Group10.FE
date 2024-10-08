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
    question: "How do Breeder/Japan auctions work?",
    answer: `Breeder auctions in Japan are highly prestigious events where some of the best koi breeders in the world showcase their finest fish. 
    These auctions are held at breeding farms across Japan, often attracting international buyers. Breeders like Dainichi, Sakai, and Marudo display 
    their highest quality Nishikigoi, ranging from baby koi to adult koi. Buyers either bid in-person or remotely through authorized agents. 
    Koi are inspected for their body shape, color patterns, and overall health, with each fish carrying a certificate of authenticity and lineage 
    to ensure the highest standard of quality. AuctionKoi.com partners with these breeders, offering U.S.-based customers the ability to participate 
    without needing to travel to Japan.`,
  },
  {
    question: "How do In-House/USA auctions work?",
    answer: `In-house auctions, which take place within the United States, offer a unique opportunity for local koi enthusiasts to acquire high-quality 
    Nishikigoi without the challenges of international shipping. AuctionKoi.com hosts regular in-house auctions featuring koi from breeders that we 
    have hand-selected for their breeding expertise and fish quality. These auctions often have both live and online components, allowing bidders 
    from across the country to participate in real-time. Every koi listed in our in-house auctions is carefully vetted to ensure its health and quality.`,
  },
  {
    question: "How does shipping work and how much does it cost?",
    answer: `At AuctionKoi.com, we take great care in ensuring that every koi is shipped safely and in optimal condition. We use specialized koi 
    shipping containers, which provide the fish with ample oxygen and water during transit. Shipping costs are based on the destination, the weight of 
    the shipment, and whether expedited shipping is required. We work with trusted carriers experienced in live animal transport, ensuring your koi 
    arrive in perfect health. Domestic shipments within the U.S. typically cost between $100 and $300, depending on the size of the koi and your location. 
    International shipments are available on request, but may incur higher fees.`,
  },
  {
    question: "What happens if my koi passes away in transit?",
    answer: `While we take every precaution to ensure your koi arrives in perfect condition, there are rare cases where a fish may pass away during transit. 
    In such cases, AuctionKoi.com offers a live arrival guarantee, meaning we will replace the koi or issue a refund, depending on availability. All shipments 
    are insured, and we ask that customers document the condition of the koi upon arrival, including photos and video. If a koi passes away, we handle the 
    insurance claim on your behalf to ensure a smooth process.`,
  },
  {
    question: "When are payments due after an auction?",
    answer: `Payments for won koi are typically due within 48 hours of the auction closing. This allows us to quickly arrange for shipping and ensures 
    that the koi are sent to their new homes in a timely manner. We accept a variety of payment methods, including major credit cards, PayPal, bank 
    transfers, and even cryptocurrencies like Bitcoin. Once your payment is confirmed, we will coordinate shipping and provide you with tracking 
    details. Failure to make a timely payment may result in the forfeiture of your bid and the koi being re-listed.`,
  },
  {
    question: "How long can I expect to wait before my koi is shipped?",
    answer: `Shipping times vary depending on the time of year, your location, and the health of the koi. After your payment has been processed, we 
    typically require 3-5 business days to prepare your koi for shipment. This includes a final health check, packaging, and coordination with our 
    shipping partners. In cooler weather, shipments are faster, as koi are less stressed during transport. However, during warmer months, we may delay 
    shipments to ensure the safety of the fish. In most cases, you can expect to receive your koi within 7-10 business days after payment is confirmed.`,
  },
  {
    question: "Do you offer boarding if I cannot receive my koi right away?",
    answer: `Yes, we provide boarding services for your koi if you're unable to receive them immediately after the auction. Our facilities ensure a safe and comfortable environment for your fish until you are ready to take them home. We prioritize the health and well-being of your koi during this time.`,
  },
  {
    question: "Is there bid sniping protection?",
    answer: `Absolutely! We have implemented bid sniping protection to ensure a fair bidding process. If a bid is placed in the last moments of an auction, we extend the auction time to give all participants a fair chance to respond. This helps maintain a transparent and competitive bidding environment.`,
  },
  {
    question: "I'm outside of the United States. Am I still eligible to bid?",
    answer: `Yes, international bidders are welcome! Our platform allows users from around the world to participate in auctions. However, please note that shipping logistics and fees may vary depending on your location, so it’s essential to review our shipping policies before bidding.`,
  },
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="about-container">
      <h1>Welcome to AuctionKoi.com!</h1>
      <div className="blurred-background">
        <h2>Welcome to AuctionKoi.com!</h2>
        <p>
          AuctionKoi.com is proud to be your premier destination for Japanese
          Koi auctions in the United States. Our platform is dedicated to
          connecting Koi enthusiasts and collectors with reputable breeders from
          Japan, offering an exceptional selection of exquisite Japanese Koi.
        </p>
        <p>
          With a deep passion for the artistry and beauty of Koi, we have
          created an online marketplace that brings together the finest breeders
          and the most discerning buyers. Our auctions provide a unique
          opportunity for Koi enthusiasts to acquire top-quality fish directly
          from renowned breeders in Japan, all from the comfort of their own
          homes.
        </p>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question ===
                "How does shipping work and how much does it cost?" && (
                <DropboxOutlined className="icon" />
              )}
              {faq.question ===
                "What happens if my koi passes away in transit?" && (
                <StockOutlined className="icon" />
              )}
              {faq.question === "When are payments due after an auction?" && (
                <PayCircleOutlined className="icon" />
              )}
              {faq.question ===
                "How long can I expect to wait before my koi is shipped?" && (
                <ClockCircleOutlined className="icon" />
              )}
              {faq.question ===
                "Do you offer boarding if I cannot receive my koi right away?" && (
                <HomeOutlined className="icon" />
              )}
              {faq.question === "Is there bid sniping protection?" && (
                <SafetyCertificateOutlined className="icon" />
              )}
              {faq.question ===
                "I'm outside of the United States. Am I still eligible to bid?" && (
                <GlobalOutlined className="icon" />
              )}
              <span>{faq.question}</span>
              <span className={`arrow ${activeIndex === index ? "open" : ""}`}>
                &#9662;
              </span>
            </div>
            <div
              className={`faq-answer-container ${
                activeIndex === index ? "show" : ""
              }`}
            >
              <div className="faq-answer">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
