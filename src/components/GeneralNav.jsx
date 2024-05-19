import { useState } from "react";
import "../styles/generalnav.css";
export default function GeneralNav() {
  const check = JSON.parse(localStorage.getItem("auth"));

  const [showMobileList, setShowMobileList] = useState(false);

  const showLinks = () => {
    setShowMobileList(!showMobileList);
  };

  return (
    <>
      <div className="topnav">
        <div className="logo-image links">
          <a href={
            check ? "/dashboard" : "/"
          } className="moneydaddy-link">
            <img src="MONEYDADDY.png" alt="MoneyDaddy" width="25" />
            <p className="moneydaddy-text">MoneyDaddy</p>
          </a>
        </div>
        <div className="links">
          <a href="/how"> HOW IT WORKS</a>
          <a href="/faqs"> FAQS </a>
          <a href="/contact"> CONTACT </a>
        </div>
      </div>

      {/* MOBILE */}
      <div className="mobile-container">
        <div className="topnav-mobile">
          <div className="logo-image">
            <a href={
              check ? "/dashboard" : "/"
            } className="moneydaddy-link">
              <img src="MONEYDADDY-2.png" alt="MoneyDaddy" width="25" />
              <span className="moneydaddy-text">MoneyDaddy</span>
            </a>
          </div>
          <button onClick={showLinks}>
            <i class="bi bi-list"></i>
          </button>
        </div>

        {showMobileList && (
          <div className="mobile-list">
            <a href="/how"> HOW IT WORKS</a>
            <a href="/faqs"> FAQS </a>
            <a href="/contact"> CONTACT </a>
          </div>
        )}
      </div>
    </>
  );
}
