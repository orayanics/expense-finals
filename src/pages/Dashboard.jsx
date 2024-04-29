import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    localStorage.clear("auth");
    navigate("/");
  };

  return (
    <div>
      <h3>Dashboard</h3>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
