import React, { useEffect, useState } from "react";
import axios from "axios";
import QuickSearchItem1 from "./QuickSearchitem1";
import { Link } from "react-router-dom";
/* import QuickSearchItem2 from "./QuickSearchItem2"; */

function QuickSearch1() {
  const [mealTypes, setMealTypes] = useState([]);

  useEffect(() => {
    const fetchData3 = async () => {
      try {
        const response = await axios.get("https://good-cyan-gopher-sari.cyclic.app/getAllMeals");
        setMealTypes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData3();
  }, []);
  return (
    <div>
      <div className="flex-container83">
        <h2 id="blue" className="leftspace">
          Quick Searches
        </h2>
        <p className="leftspace" id="parafont">
          Discover Restaurants by type of meal
        </p>
        <div className="container">
          <div className="row">
            {mealTypes.map((item) => {
              return (
                <Link to='/filter'
                  className="col-xxl-4 col-xl-4 col-lg-6 col-md-4 col-sm-6 col-xs-12 p-4 shadow-lg p-3"
                  style={{ display: "flex",flexWrap:"wrap"}}
                >
                  <QuickSearchItem1
                    img={item.image}
                    detail={item.content}
                    title={item.name}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickSearch1;
