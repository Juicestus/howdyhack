// import Header from "../components/Header";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";
import { Navigate, useBeforeUnload } from "react-router-dom";

import { auth, getUserDB } from "../FirebaseClient";
import { AuthContext } from "../components/AuthContext";
import { SidebarDrawer } from "../components/SidebarDrawer";
import { CircularProgressWithLabel } from "../components/CircularProgressWithLabel";
import { IconButton } from "@mui/material";
import { Topics } from "../data/Types";
// import MenuIcon from '@mui/icons-material/Menu';


export default () => {

  const user = useContext(AuthContext);

  const signOut = async () => {
    await auth.signOut();
  };

  const [topicTree, setTopicTree] = useState<Topics>({})

  useEffect(() => {
    if (user) {
      getUserDB(user.uid).then(d => setTopicTree(d));
    }

  }, [user, setTopicTree]);

  const calcCompletion = (d: Topics): number => {
      let completed = 0.0;
      let total = 0.0;
      Object.keys(d).map(k => {
        Object.keys(d[k].subtopics).map(sk => {
          if (d[k].subtopics[sk].completed) {
            completed++;
          }
          total++;
        });
      });
      return (completed/total) * 100;
  }


  return (
    <>

    {/* <IconButton onClick={() => {}} sx={{ position: "fixed", top: 0, left: 0, zIndex: 2000 }}><MenuIcon/></IconButton> */}
    <SidebarDrawer/>
      
      {/* <Header fluid/> */}

      <p style={{marginBottom: "5rem"}}></p>

      <Container style={{ maxWidth: "40rem" }} fluid>

        <Card>
          <Card.Header><h1>Howdy, {user?.displayName || "Ag"}!</h1></Card.Header>

          <Card.Body> 

            <Row className="mt-2">
              <Col xs={8}>
                <p>Lets take a look at your progress!</p>

                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <Button variant="outline-success" type="button" size="sm" className="" onClick={undefined}>
                  Pick up where you left off
                </Button>
              </Col>
              <Col xs={4} className="p-3">
                <CircularProgressWithLabel value={calcCompletion(topicTree)} color="success"/>
              </Col>
            </Row>

          </Card.Body>
        </Card>

      </Container>



    </>
  );
};