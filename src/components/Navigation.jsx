import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

export default function Navigation() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <nav className="d-flex flex-column justify-content-between container-fluid h-100">
      <div>
        <div>
          <p>MoneyMommy</p>
        </div>

        <div>
          <a href={`/dashboard`} className="d-flex flex-row mb-3 gap-2">
            <i className="bi bi-bank"></i>
            <button>Dashboard</button>
          </a>

          <a href={`/Expense`} className="d-flex flex-row mb-3 gap-2">
            <i className="bi bi-cash"></i>
            <button>Expense</button>
          </a>
        </div>
      </div>

      <div className="d-flex flex-row mb-3 gap-2">
        <i className="bi bi-box-arrow-left"></i>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
