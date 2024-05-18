import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navigation from "../components/Navigation";

import { Container, Row, Col } from "react-bootstrap";
import "../styles/routes.css";
import "../styles/accordion.css";

const ProtectedRoutes = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container-height">
    <Container fluid>
      <Row>
        <Col xs={12} lg={2} className="py-3 navigation-col">
          <Navigation />
        </Col>
        <Col xs={12} lg={10} className="py-3 px-5 overflow-hidden">
          <Outlet />
        </Col>
      </Row>
    </Container>
    </div>

  );
};

export default ProtectedRoutes;
