import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./components/AuthProvider";
import Login from "./pages/Login";
import Home from "./pages/Home";

import { ThemeProvider } from "@material-tailwind/react";
import SignUp from "./pages/Create";
import Dashboard from "./pages/Dashboard";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
      <ThemeProvider>
        <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
    </AuthProvider>
        </Router>
      </ThemeProvider>
  </React.StrictMode>
);
