import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navigation from "../components/Navigation";

import { Container, Row, Col } from "react-bootstrap";
import "../styles/routes.css";

const ProtectedRoutes = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) {
    return <Navigate to="/" />;
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12} lg={2} className="bg-light pt-3 navigation-col">
          <Navigation />
        </Col>
        <Col xs={12} lg={9} className="pt-3 overflow-auto">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default ProtectedRoutes;
