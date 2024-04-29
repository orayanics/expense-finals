import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;