// import Header from "../components/Header";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";
import { redirect, useBeforeUnload, useNavigate } from "react-router-dom";
// import {Input} from "@nextui-org/react";
// import { Input } from "@material-tailwind/react";

import { auth } from "../FirebaseClient"

export default () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signIn = async () => {
    console.log(email, password);

    try {
      await auth.signInWithEmailAndPassword(email , password);
      navigate("/");

      console.log(auth.currentUser);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  

  return (
    <>
      {/* <Header fluid/> */}

      <p style={{marginBottom: "5rem"}}></p>

      <Container style={{ maxWidth: "20rem" }} fluid>

        <Card>
          <Card.Header>Login</Card.Header>
          <Card.Body>

            <FormControl sx={{ mr: 1, mt: 0, mb: 1, width: '100%' }} variant="outlined" size="small">
              <InputLabel htmlFor="outlined">Email</InputLabel>
              <OutlinedInput
                onChange={e => setEmail(e.target.value)}
                id="outlined"
                label="Email"
              />
            </FormControl>

            <FormControl sx={{ mr: 1, mt: 1, mb: 1, width: '100%' }} variant="outlined" size="small">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                onChange={e => setPassword(e.target.value)}
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <div className="mt-2">
                <Button variant="success" type="button" size="sm" className="login-btn" onClick={signIn} style={{marginRight: '3%'}}>
                  Log In
                </Button>

                <Button variant="outline-success" type="button" size="sm" className="login-btn" onClick={() => navigate("/signup")} style={{marginLeft: '3%'}}>
                  Sign Up
                </Button>
              </div>

          </Card.Body>
        </Card>

       
      </Container>
    </>
  );
};