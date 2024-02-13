import React from "react";
import ReactDOM from "react-dom/client";
/* import Home from "./components/Home"; */
import Router from "./components/Router";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="250958236336-5h0d9od8qviembpet0su3bpc59bmqq7m.apps.googleusercontent.com">
      <Router />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
