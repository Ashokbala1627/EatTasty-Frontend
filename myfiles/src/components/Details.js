import React, { useState, useEffect } from "react";
import "../Styles/details.css";
import image1 from "./Assets/img1.jpg";
import image2 from "./Assets/img2.jpg";
import image3 from "./Assets/img3.jpg";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-tabs/style/react-tabs.css";
import queryString from "query-string";
import axios from "axios";
import Modal from "react-modal";

function Details({ username, email }) {
  const [list, setList] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [foodType, setFoodType] = useState("");
  const [payment, setPayment] = useState(0); // New state for payment total
  const [alert, setAlert] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [menuItems, setMenuItems] = useState([
    { name: "Chicken Biriyani", price: 100, quantity: 0 },
    { name: "Mutton Biriyani", price: 220, quantity: 0 },
    { name: "Naan", price: 20, quantity: 0 },
    { name: "Parotta", price: 15, quantity: 0 },
  ]);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    const parseQuery = queryString.parse(window.location.search);
    const parseId = parseQuery.hotel;

    axios.get(`https://good-cyan-gopher-sari.cyclic.app/filterbyid/${parseId}`).then((response) => {
      const restaurant = response.data;

      const hasFastFoodCuisine = restaurant.cuisine.some(
        (cuisine) => cuisine.name === "Fast Food"
      );

      if (hasFastFoodCuisine) {
        setList(restaurant.name);
        setPhoneNumber(restaurant.contact_number);
        setLocality(restaurant.locality);
        setCity(restaurant.city);
        setFoodType(restaurant.cuisine[1].name);
      }
    });
  }, []);

  const handleContactButtonClick = () => {
    setMenuIsOpen(true);
  };

  const handleCloseMenuModal = () => {
    setMenuIsOpen(false);
  };

  const handleIncrement = (index) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index].quantity =
      (updatedMenuItems[index].quantity || 0) + 1;
    setMenuItems(updatedMenuItems);
    setSubTotal(subTotal + updatedMenuItems[index].price);
  };

  const handleDecrement = (index) => {
    if (menuItems[index].quantity > 0) {
      const updatedMenuItems = [...menuItems];
      updatedMenuItems[index].quantity -= 1;
      setMenuItems(updatedMenuItems);
      setSubTotal(subTotal - updatedMenuItems[index].price);
    }
  };
  const handleToPay = (e) => {
    e.preventDefault();
    if (payment === "") {
      setAlert("Please select the item before clicking the payment");
    } else {
      // Calculate the total amount based on selected menu items
      const totalAmount = menuItems.reduce(
        (total, menuItem) => total + menuItem.price * menuItem.quantity,
        0
      );
  
      // Convert total amount to paise (Razorpay expects the amount in paise)
      const amountInPaise = totalAmount * 100;
  
      const options = {
        key: "rzp_test_LsoqfM2rv5MpL0",
        key_secret: "6W39jPHgwxA8QvUyImkOAnmf", // corrected typo here
        amount: amountInPaise,
        currency: "INR",
        name: "Eat Tasty",
        description: "Payment Methods",
        handler: function (response) {
          console.log(response.razorpay_payment_id);
        },
        prefill: {
          name: username,
          email: email,
        },
        notes: {
          address: "Razorpay corporate office",
        },
        theme: {
          color: "#0e0e52",
        },
      };
      const pay = new window.Razorpay(options);
      pay.open();
    }
  };
  

  return (
    <div className="carousel-container">
      <Carousel showThumbs={false}>
        <div>
          <img src={image1} width={"100%"} height={"450px"} alt="Not Found" />
        </div>
        <div>
          <img src={image2} width={"100%"} height={"450px"} alt="Not Found" />
        </div>
        <div>
          <img src={image3} width={"100%"} height={"450px"} alt="Not Found" />
        </div>
      </Carousel>
      <div className="tabHead">
        <h2 style={{ color: "#0e0e52", fontWeight: "bold" }}>{list}</h2>
        <button className="online-btn" onClick={handleContactButtonClick}>
          Place Online Orders
        </button>
      </div>
      <Tabs
        selectedIndex={selectedTab}
        onSelect={(index) => setSelectedTab(index)}
      >
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Contact</Tab>
        </TabList>
        <TabPanel>
          <b className="title">{foodType}</b>
          <address className="detail">{`${locality}-${city}`}</address>
        </TabPanel>
        <TabPanel>
          <b className="title">Phone Number</b>
          <div className="detail">{phoneNumber}</div>
        </TabPanel>
      </Tabs>

      <Modal
        isOpen={menuIsOpen}
        onRequestClose={handleCloseMenuModal}
        className="menu-modal"
        overlayClassName="menu-overlay"
      >
        <h2 className="headingMenu">Menu</h2>
        {menuItems.map((menuItem, index) => (
          <div className="menu-item" key={index}>
            <h3 className="menu-item1">{menuItem.name}</h3>
            <p
              className={"pricebox"}
              style={{ fontSize: "16px", color: "green" }}
            >
              Price: Rs.{menuItem.price}
            </p>
            <div className="karts">
              <button
                className="boxnone"
                style={{ padding: "5px" }}
                onClick={() => handleDecrement(index)}
              >
                -
              </button>
              <button className="boxnone" style={{ fontSize: "16px" }}>
                Qty : {menuItem.quantity || 0}
              </button>
              <button
                className="boxnone"
                style={{ padding: "5px" }}
                onClick={() => handleIncrement(index)}
              >
                +
              </button>
            </div>
          </div>
        ))}
        <p
          className="subTotal"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          Sub-total: Rs.{subTotal}
        </p>
        <p>{alert}</p>
        <div className="modal-buttons">
          <button onClick={handleCloseMenuModal} className="close">
            Close
          </button>
          <button onClick={handleToPay} className="addtocart">
            Proceed to pay
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Details;
