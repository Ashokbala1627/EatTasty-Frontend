import React, { useState, useEffect } from "react";
import "../Styles/filter.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Filter() {
  const [filterLocation, setFilterLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState([]);
  const [locationFetch, setLocationFetch] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCostRange, setSelectedCostRange] = useState("");
  const [sortBy, setSortBy] = useState("");
  const itemsPerPage = 2;
  const navigation = useNavigate();
  useEffect(() => {
    axios
      .get("https://good-cyan-gopher-sari.cyclic.app/getAllHotels")
      .then((response) => {
        setLocationFetch(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const LocationDataByFilterPage = async () => {
      try {
        const response = await axios.get("https://good-cyan-gopher-sari.cyclic.app/getAllLocations");
        const uniqueCities = response.data.reduce((acc, curr) => {
          if (!acc.some((item) => item.name === curr.name)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        setFilterLocation(uniqueCities);
      } catch (error) {
        console.error(error);
      }
    };

    LocationDataByFilterPage();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = locationFetch.filter((item) => {
        const locationMatch =
          selectedLocation === "" ||
          item.locality.toLowerCase() === selectedLocation.toLowerCase();
        const cuisineMatch =
          cuisineFilter.length === 0 ||
          cuisineFilter.some((cuisine) =>
            item.cuisine.map((c) => c.name).includes(cuisine)
          );

        let costMatch = true;
        if (selectedCostRange) {
          switch (selectedCostRange) {
            case "<500":
              costMatch = item.min_price < 500;
              break;
            case "500 to 1000":
              costMatch = item.min_price >= 500 && item.min_price <= 1000;
              break;
            case "1000 to 1500":
              costMatch = item.min_price >= 1000 && item.min_price <= 1500;
              break;
            case "1500 to 2000":
              costMatch = item.min_price >= 1500 && item.min_price <= 2000;
              break;
            case "2000+":
              costMatch = item.min_price >= 2000;
              break;
            default:
              costMatch = true;
              break;
          }
        }

        return locationMatch && cuisineMatch && costMatch;
      });

      if (sortBy === "lowToHigh") {
        filtered.sort((a, b) => a.min_price - b.min_price);
      } else if (sortBy === "highToLow") {
        filtered.sort((a, b) => b.min_price - a.min_price);
      }

      setFilteredResults(filtered);
      // Reset current page to 1 whenever filters change
      setCurrentPage(1);
    };
    applyFilters();
  }, [
    locationFetch,
    selectedLocation,
    cuisineFilter,
    selectedCostRange,
    sortBy,
  ]);

  const handleCuisineChange = (event) => {
    const value = event.target.value;
    if (cuisineFilter.includes(value)) {
      setCuisineFilter(cuisineFilter.filter((cuisine) => cuisine !== value));
    } else {
      setCuisineFilter([...cuisineFilter, value]);
    }
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleCostChange = (event) => {
    setSelectedCostRange(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filterSuggest = (item) => {
    navigation(`/details?hotel=${item._id}`);
    console.log(item);
  };
  
  return (
    <div className="container">
      <h1 className="headfirst">Breakfast Places in Mumbai</h1>
      <main>
        <section className="leftbox7">
          <h3 className="headthird">Filters</h3>
          <h4 className="headfourth">Select Location</h4>
          <select
            className="option"
            onChange={handleLocationChange}
            value={selectedLocation}
          >
            <option disabled value="">
              Select Location
            </option>
            {filterLocation.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="line7">
            <h4 className="headfourth">Cuisine</h4>
            <input
              type="checkbox"
              onChange={handleCuisineChange}
              value={"North Indian"}
            />
            North Indian <br />
            <input
              type="checkbox"
              onChange={handleCuisineChange}
              value={"South Indian"}
            />
            South Indian <br />
            <input
              type="checkbox"
              onChange={handleCuisineChange}
              value={"Chinese"}
            />
            Chinese <br />
            <input
              type="checkbox"
              onChange={handleCuisineChange}
              value={"Fast food"}
            />
            Fast food <br />
            <input
              type="checkbox"
              onChange={handleCuisineChange}
              value={"Street food"}
            />
            Street food
          </div>

          <div className="line7">
            <h4 className="headfourth">Cost For Two</h4>
            <input
              type="radio"
              name="cost"
              value="<500"
              onChange={handleCostChange}
            />
            Less than ₹500 <br />
            <input
              type="radio"
              name="cost"
              value="500 to 1000"
              onChange={handleCostChange}
            />
            ₹500 to ₹1000 <br />
            <input
              type="radio"
              name="cost"
              value="1000 to 1500"
              onChange={handleCostChange}
            />
            ₹1000 to ₹1500 <br />
            <input
              type="radio"
              name="cost"
              value="1500 to 2000"
              onChange={handleCostChange}
            />
            ₹1500 to ₹2000 <br />
            <input
              type="radio"
              name="cost"
              value="2000+"
              onChange={handleCostChange}
            />
            ₹2000+
          </div>

          <div className="line7">
            <h4 className="headfourth">Sort</h4>
            <input
              type="radio"
              name="sort"
              value="lowToHigh"
              onChange={handleSortChange}
            />
            Price low to high <br />
            <input
              type="radio"
              name="sort"
              value="highToLow"
              onChange={handleSortChange}
            />
            Price high to low <br />
          </div>
        </section>

        <section className="bigbox7">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <section
                className="sidebox7"
                key={item._id}
                onClick={() => filterSuggest(item)}
              >
                <img src={item.image} alt="Idly image" className="leftm7" />
                <dl>
                  <dd className="Bold7">{item.name}</dd>
                  <h5 className="paratext">
                    {item.locality}, {item.city}
                  </h5>
                </dl>
                <hr />
                <dl>
                  <div className="headleft7">
                    <dt>
                      CUISINE :&nbsp;&ensp;
                      {item.cuisine.length > 0
                        ? item.cuisine[0].name
                        : "No cuisine"}
                    </dt>
                    <dd>COST :&nbsp;{item.min_price}</dd>
                  </div>
                </dl>
              </section>
            ))
          ) : (
            <div
              className="sidebox7"
              style={{
                textAlign: "center",
                color: "red",
                fontSize: "30px",
                padding: "100px",
              }}
            >
              No result found
            </div>
          )}
          {filteredResults.length > itemsPerPage && (
            <section className="row7">
              {currentPage > 1 && (
                <a href="#" onClick={() => handlePageChange(currentPage - 1)}>
                  <div className="box7">&lt;</div>
                </a>
              )}
              {Array.from(
                { length: Math.ceil(filteredResults.length / itemsPerPage) },
                (_, index) => (
                  <a
                    href="#"
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    <div className="box7">{index + 1}</div>
                  </a>
                )
              )}
              {currentPage <
                Math.ceil(filteredResults.length / itemsPerPage) && (
                <a href="#" onClick={() => handlePageChange(currentPage + 1)}>
                  <div className="box7">&gt;</div>
                </a>
              )}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default Filter;
