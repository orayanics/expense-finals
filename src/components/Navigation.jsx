import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { successAlert } from "../utils/toastAlert";
import { useState } from "react";
import "../styles/navigation.css";

export default function Navigation() {
  const navigate = useNavigate();
  const [showMobileList, setShowMobileList] = useState(false);

  const showLinks = () => {
    setShowMobileList(!showMobileList);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("auth");
    successAlert("Logout successful");
    navigate("/");
  };

  return (
    <>
      <nav>
        <div className="nav-container">
          <div className="logo-container">
            <img src="MONEYDADDY-2.png" alt="logo" className="logo"></img>
            <p className="moneydaddy-tl">MoneyDaddy</p>
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>

          <div>
            <a href={`/dashboard`} className="">
              <p className="nav-btn">Dashboard</p>
            </a>

            <a href={`/Expense`} className="">
              <p className="nav-btn">Expenses</p>
            </a>
          </div>
        </div>
      </nav>

      <div className="mobile-container">
        <div className="topnav-mobile">
          <div className="logo-image">
            <a href="/" className="moneydaddy-link">
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
            <a href="/dashboard"> Dashboard</a>
            <a href="/expense"> Your Expenses </a>
          </div>
        )}
      </div>
    </>
  );
}
