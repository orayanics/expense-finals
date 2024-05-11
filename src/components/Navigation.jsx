import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { successAlert } from '../utils/toastAlert'
import '../styles/navigation.css';

export default function Navigation() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("auth");
    successAlert("Logout successful")
    navigate("/");
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="logo-container">
          <img src="MONEYDADDY-2.png" alt="logo" className="logo"></img><p className="moneydaddy-tl">MoneyDaddy</p>
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
        
        <div>
          <a href={`/dashboard`} className="">
            <p className="nav-btn">Dashboard</p>
          </a>

          <a href={`/Expense`} className="">
            <p className="nav-btn">Your Expenses</p>
          </a>
          
          <a href={`/Expense`} className="">
            <p className="nav-btn">How to use</p>
          </a>

          <a href={`/Expense`} className="">
            <p className="nav-btn">FAQ</p>
          </a>

          <a href={`/Expense`} className="">
            <p className="nav-btn">Contact</p>
          </a>
        </div>
      </div>
    </nav>
  );
}
