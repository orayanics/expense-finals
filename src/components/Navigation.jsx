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
    <nav className="d-flex flex-column justify-content-between container-fluid h-100">
      <div>
        <div className="logo-container">
          <img src="MONEYDADDY-2.png" alt="logo" className="logo"></img><p className="moneydaddy-tl">MoneyDaddy</p>
        </div>
        
        <div>
          <a href={`/dashboard`} className="d-flex flex-row mb-3 gap-2">
            <p className="nav-btn">Dashboard</p>
          </a>

          <a href={`/Expense`} className="d-flex flex-row mb-3 gap-2">
            <p className="nav-btn">Expense</p>
          </a>
        </div>
      </div>

      <div className="d-flex flex-row mb-3 gap-2">

        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}
