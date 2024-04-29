import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("auth"));

  const logout = async () => {
    await signOut(auth);
    localStorage.clear("auth");
    navigate("/");
  };

  return (
    <>
      <div>
        <h3>Dashboard</h3>
        <button onClick={logout}>Logout</button>
      </div>

      {
        user && (
          <div>
            <h4>{user.name}</h4>
            <img src={user.photo} alt={user.name} />
          </div>
        )
      }
    </>
  );
}
