import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Modal from "react-modal";
import "../Styles/header.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Header = () => {
  const location = useLocation();
  const isHomeOrHomePage =
    location.pathname === "/" || location.pathname === "/home";
  const [modalIsOpen, setIsOpen] = useState(false);
  const [signupOpen, setsignupOpen] = useState(false);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gLogin, setGlogin] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false); // State variable for signup success
  const [loginError, setLoginError] = useState(""); // State variable for login error message
  const [googleSynced, setGoogleSynced] = useState(false); // State variable to track Google account sync

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const Signup = async () => {
    const Data = { username, email, password };
    try {
      const response = await axios.post("https://good-cyan-gopher-sari.cyclic.app/signup", Data);
      console.log(response.data.username, "Signup SuccessFully");
      setSignupSuccess(true); // Set signup success
      setsignupOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const Login = async () => {
    try {
      const response = await axios.post("https://good-cyan-gopher-sari.cyclic.app/login", {
        email: email,
        password: password,
      });
      console.log(response.data.user, "Successfully logged in");
      setGlogin(true);
      setUserName(response.data.user.username);
      setEmail(""); // Clear email field on successful login
      setPassword(""); // Clear password field on successful login
      setGoogleSynced(false); // Reset Google account sync status
      closeModal();
    } catch (err) {
      console.log(err.response);
      if (err.response.status === 401) {
        setLoginError("Invalid email or password. Please try again.");
      } else {
        setLoginError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setLoginError(""); // Clear login error message when closing the modal
  };
  const opensignup = () => {
    setsignupOpen(true);
  };
  const closesignup = () => {
    setsignupOpen(false);
  };
  const logOut = () => {
    setGlogin(false);
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    setGlogin(true);
    const result = jwtDecode(credentialResponse.credential);
    setUserName(result.given_name);
    setEmail(result.email);
    setGoogleSynced(true); // Set Google account synced
  };

  // Function to handle login button click
  const handleLogin = () => {
    // Check if email is empty
    if (email.trim() === "") {
      setLoginError("Email is required.");
      return;
    }

    // Check if password is empty
    if (password.trim() === "") {
      setLoginError("Password is required.");
      return;
    }

    // Continue with login logic...
    Login();
  };

  return (
    <nav className={`parent ${isHomeOrHomePage ? "black-bg" : "blue-bg"}`}>
      {!isHomeOrHomePage && (
        <Link to="/home" className="child_logo">
          ET:)
        </Link>
      )}
      <div className="buttons">
        {!gLogin ? (
          <div className="right-buttons">
            <button className="child_1login" onClick={openModal}>
              Login
            </button>
            <button className="child_2create" onClick={opensignup}>
              Create an account
            </button>
          </div>
        ) : (
          <div className="buttons">
            <button className="btn text-white fw-bold mlogin text-center ">
              {username}
            </button>
            <button
              className="btn text-white bg-transparent fw-bold acc"
              onClick={logOut}
            >
              LogOut
            </button>
          </div>
        )}
        <Modal isOpen={modalIsOpen} style={customStyles}>
          <form className="modal-form">
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div>
              <button type="button" className="submit" onClick={handleLogin}>
                Login
              </button>
              <button type="button" className="cancel" onClick={closeModal}>
                Cancel
              </button>
              {!googleSynced && (
                <GoogleLogin
                  className="googleLink"
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              )}
            </div>
            {loginError && (
              <p className="text-danger medium" style={{ fontWeight: "bold" }}>
                {loginError}
              </p>
            )}
          </form>
        </Modal>
        <Modal isOpen={signupOpen} style={customStyles}>
          <form className="modal-form">
            <h2>Create an account</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <br />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div>
              <button
                type="button"
                className="Create an account"
                onClick={Signup}
              >
                Create an Account
              </button>
              <button type="button" className="cancel" onClick={closesignup}>
                Cancel
              </button>
            </div>
            {signupSuccess && (
              <p
                className="text-success bold"
                style={{ color: "green", fontWeight: "bold" }}
              >
                Signup Successful!
              </p>
            )}
          </form>
        </Modal>
      </div>
    </nav>
  );
};

export default Header;
