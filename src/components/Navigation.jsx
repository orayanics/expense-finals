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
    <nav className="d-flex flex-column container-fluid">
      <div>
        <p>MoneyMommy</p>
      </div>

      <div className="d-flex flex-column mb-3">
        <a href={`/dashboard`}>
          <button>Dashboard</button>
        </a>

        <a href={`/Expense`}>
          <button>Expense</button>
        </a>

        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
