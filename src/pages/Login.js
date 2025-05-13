// client/src/pages/Login.js
import React, { useState } from "react";
import { apiRequest } from "../api"; 
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem, login, logout } from "../GlobalSlice"; // ✅ fix here
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const loggedIn = sessionStorage.getItem("LoggedIn");

  const handleLogOut = () => {
    sessionStorage.clear();         // clear session data
    dispatch(logout());             // update Redux state
    window.location.reload();       // optional: refresh the page if needed
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }
    setErrorMsg("");

    try {
      const res = await fetch("http://34.227.78.71/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error("Invalid server response: " + text);
      }

      const result = await res.json();
      if (!res.ok) {
        setErrorMsg(result.message || "Login failed.");
        return;
      }
      console.log(result);
      localStorage.setItem("token", result.token);
      dispatch(login({ role: result.role }));
      sessionStorage.setItem("LoggedIn", true);
      sessionStorage.setItem("role", result.role);
      sessionStorage.setItem('JWT', result.token);

      if (result?.role === "Admin") {
        navigate("/admin");
      } else if (result?.role === "RestaurantManager") {
          navigate("/manager");
      } else {
        navigate("/"); // ✅ For Customer
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {!loggedIn ? (
          <>
            {" "}
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMsg}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              mt: 8,
              p: 4,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              You are already logged In!!
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Button
                type="submit"
                variant="outlined"
                color="erroe"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => handleLogOut()}
              >
                Logout
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Login;
