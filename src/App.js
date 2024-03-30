import React, { useState } from "react";
import firebase from "./firebase.js";
import { BrowserRouter, Routes, Route,Navigate  } from "react-router-dom";
import { Button, Container, Row, Col } from "reactstrap";
import Signup from "./Signup.js";
import Home from "./Home.js";
import "firebase/database"; //

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      localStorage.setItem("isAuthenticated", "false");
      setIsAuthenticated(false);
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <BrowserRouter>
      <Routes>
            <Route exact
          path="/"
          element={<Signup handleAuth={handleAuth} />}
          // render={(props) => <Signup {...props} handleAuth={handleAuth} />}
           />
        <Route path="/home" element={isAuthenticated ? <Home handleLogout={handleLogout} /> : <Navigate to="/" />} />
          </Routes>
    </BrowserRouter>
  );
};

export default App;
