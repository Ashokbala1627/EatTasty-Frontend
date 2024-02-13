import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/home.css";
import { useNavigate } from "react-router-dom";

function Wallpaper() {
  const [locations, setLocations] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [hotel, setHotel] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const navigation = useNavigate();

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response = await axios.get("https://good-cyan-gopher-sari.cyclic.app/getAllLocations");
        const uniqueCities = response.data.reduce((acc, curr) => {
          if (!acc.some((item) => item.name === curr.name)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        setLocations(uniqueCities);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData1();
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const response = await axios.get("https://good-cyan-gopher-sari.cyclic.app/getAllHotels");
        setHotel(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData2();
  }, []);

  const handleSearch = (event) => {
    const inputText = event.target.value;
    setUserInput(inputText);

    let suggests;
    if (selectedCity) {
      suggests = hotel.filter(
        (item) =>
          item.name.toLowerCase().includes(inputText.toLowerCase()) &&
          item.locality === selectedCity
      );
    } else {
      suggests = hotel.filter((item) =>
        item.name.toLowerCase().includes(inputText.toLowerCase())
      );
    }

    setSuggestion(suggests);
  };

  const filterSuggest = (obj) => {
    navigation(`/details?hotel=${obj._id}`);
    console.log(obj);
  };

  const handleCityChange = (event) => {
    const selectedCityId = event.target.value;
    setSelectedCity(selectedCityId);
  };

  const showSuggestion = () => {
    if (suggestion.length === 0 && userInput === undefined) {
      return null;
    }
    if (suggestion.length > 0 && userInput === "") {
      return null;
    }
    if (suggestion.length === 0 && userInput !== "") {
      return (
        <ul className="suggestions" style={{ height: "40px" }}>
          <li>No Search Found</li>
        </ul>
      );
    }
    return (
      <ul>
        {suggestion.map((hotel) => (
          <li
            className="suggestions"
            onClick={() => filterSuggest(hotel)}
            key={hotel._id}
          >
            <h4 style={{ fontSize: "16px", fontWeight: "bold" }}>
              {hotel.name}
            </h4>
            <p style={{ fontSize: "14px", color: "gray" }}>
              {hotel.locality}, {hotel.city}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <div className="img83"></div>
      <div className="top-section83">
        <img src="./Assets/logo.png" alt="logo" className="logo83" />
        <div className="heading83">
          Find the best Restaurants, cafes, and bars
        </div>
        <div className="option2">
          <select
            className="option83"
            defaultValue=""
            onChange={handleCityChange}
          >
            <option value="" disabled>
              Select the city
            </option>
            {locations.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}, {item.city}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search for Restaurants"
            className="input83"
            onChange={handleSearch}
          />
          {showSuggestion()}
        </div>
      </div>
    </div>
  );
}

export default Wallpaper;