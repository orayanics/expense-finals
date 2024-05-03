import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <div>
        <h3>Dashboard</h3>
      </div>

      {user && (
        <div>
          <h4>{user.name}</h4>
          <img src={user.photo} alt={user.name} />
        </div>
      )}
    </>
  );
}
