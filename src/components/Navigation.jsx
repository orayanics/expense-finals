import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

export default function Navigation() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    localStorage.clear("auth");
    navigate("/");
  };

  return (
    <nav>
      <div>
        <p>MoneyMommy</p>
      </div>

      <div>
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
