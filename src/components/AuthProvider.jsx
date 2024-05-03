import { useEffect } from "react";
import Login from "../components/Login";
import { useNavigate } from "react-router-dom";

const AuthProvider = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Login />
    </>
  );
};

export default AuthProvider;
