// import Header from "../components/Header";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";
import { Navigate, useBeforeUnload } from "react-router-dom";

import { auth } from "../FirebaseClient";
import { AuthContext } from "../components/AuthContext";

export default () => {

  const user = useContext(AuthContext);

  return (
    <>
      {user && (<Navigate to="/dashboard" replace={true} />)}

      
    </>
  );
};