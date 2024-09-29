// import Header from "../components/Header";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";
import { redirect, useBeforeUnload, useNavigate } from "react-router-dom";
// import {Input} from "@nextui-org/react";
// import { Input } from "@material-tailwind/react";

import { auth, createUserDB } from "../FirebaseClient"

export default () => {

  const isValidEmailAddress = (emailAddress: string): boolean =>  {
    const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
  }

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confPassword, setConfPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const createAccount = async () => {

    if (firstName.length <= 0 || lastName.length <= 0) {
      alert("Error: Please fill in your first and last name");
      return;
    }

    try {
      await auth.createUserWithEmailAndPassword(email , password);
      if (auth.currentUser) {
        await auth.currentUser.updateProfile({displayName: firstName + " " + lastName});
        createUserDB(auth.currentUser?.uid);
      } else {
        console.log("Oh shit! This isnt good.")
      }
      navigate("/");
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

            <FormControl sx={{ mr: "3%", mt: 0, mb: 2, width: '47%' }} variant="outlined" size="small">
              <InputLabel htmlFor="outlined">First Name</InputLabel>
              <OutlinedInput
                error={false}
                onChange={e => setFirstName(e.target.value)}
                id="outlined"
                label="First Name"
              />
            </FormControl>

            <FormControl sx={{ ml: "3%", mr: 0, mt: 0, mb: 2, width: '47%' }} variant="outlined" size="small">
              <InputLabel htmlFor="outlined">Last Name</InputLabel>
              <OutlinedInput
                error={false}
                onChange={e => setLastName(e.target.value)}
                id="outlined"
                label="Last Name"
              />
            </FormControl>

            <FormControl sx={{ mr: 1, mt: 0, mb: 1, width: '100%' }} variant="outlined" size="small">
              <InputLabel htmlFor="outlined">Email</InputLabel>
              <OutlinedInput
                error={!isValidEmailAddress(email) && email.length > 0}
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

            <FormControl sx={{ mr: 1, mt: 1, mb: 1, width: '100%' }} variant="outlined" size="small">
              <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
              <OutlinedInput
                error={confPassword !== password}
                onChange={e => setConfPassword(e.target.value)}
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
                label="Confirm Password"
              />
            </FormControl>

              <div className="mt-2">
                <Button variant="outline-success" type="button" size="sm" className="login-btn" onClick={() => navigate("/login")} style={{marginRight: '3%'}}>
                  Log In
                </Button>

                <Button variant="success" type="button" size="sm" className="login-btn" onClick={createAccount} style={{marginLeft: '3%'}}>
                  Sign Up
                </Button>
              </div>

          </Card.Body>
        </Card>

       
      </Container>
    </>
  );
};