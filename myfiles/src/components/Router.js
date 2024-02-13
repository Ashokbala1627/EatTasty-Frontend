import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Filter from "./Filter";
import Details from "./Details";
import axios from "axios";

function Router() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // Function to update email and username
  const updateUser = (newEmail, newUsername) => {
    setEmail(newEmail);
    setUsername(newUsername);
  };

  useEffect(() => {
    // Fetch user data or perform any other initialization logic
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://good-cyan-gopher-sari.cyclic.app/api/user");
        const userData = response.data;
        // Update email and username states with fetched data
        updateUser(userData.email, userData.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Call fetchUserData when the component mounts
    fetchUserData();
  }, []);

  return (
    <BrowserRouter>
      <Header email={email} username={username} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/filter" element={<Filter />} />
        {/* Pass email and username props to Details component */}
        <Route
          path="/details"
          element={<Details email={email} username={username} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
