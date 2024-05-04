import { Outlet, Navigate } from "react-router-dom";
import Navigation from "../components/Navigation";

const ProtectedRoutes = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {auth && <Navigation />}
      <Outlet/>
    </>
  );
};

export default ProtectedRoutes;
