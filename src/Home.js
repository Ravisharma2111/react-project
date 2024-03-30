import React, { useState,useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import firebase from "./firebase.js";
import "firebase/database"; //

export default function Home({ handleLogout }) {
  const [age, setAge] = React.useState("");
  const [data, setData] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  // useEffect(() => {
  //   console.log("datadata");

  //   // Fetch data from Firebase Realtime Database
  //   const fetchData = async () => {
  //     try {
  //       const snapshot = await firebase.database().ref().once("value");
  //       const data = snapshot.val();
  //       if (data) {
  //         // Update state with fetched data
  //         setData(data);
  //         console.log("datadata", data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []); // Run this effect only once on component mount
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch countries from Firebase Realtime Database
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const snapshot = await firebase.database().ref().once("value");
        const countriesData = snapshot.val();
        if (countriesData) {
          setCountries(countriesData);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Handle country change
  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    // Reset state and city dropdowns
    setSelectedState("");
    setSelectedCity("");
    // Fetch states for the selected country
    if (country && countries[country] && countries[country].states) {
      setStates(countries[country].states);
    } else {
      setStates([]);
    }
  };

  // Handle state change
  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    // Reset city dropdown
    setSelectedCity("");
    // Fetch cities for the selected state
    if (state && states[state] && states[state].cities) {
      setCities(states[state].cities);
    } else {
      setCities([]);
    }
  };

  // Handle city change
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  console.log("countries", countries);
  console.log("selectedCountry", selectedCountry);
  console.log("selectedState", selectedState);
  console.log("selectedCity", selectedCity);
  console.log("states", states);
  console.log("cities", cities);




  

  return (
    <div style={{backgroundColor:'#94b8b8',height: '592px' }}>
     <div style={{ display: "flex", justifyContent: "end",paddingTop: '20px',paddingRight: '20px' }}>
        <Button variant="contained" sx={{backgroundColor: '#476b6b'}} onClick={handleLogout}>
          Logout
        </Button>
      </div>
     <div style={{display: 'flex',justifyContent: 'center',paddingTop: '120px' }}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="country-label">Country</InputLabel>
        <Select
          labelId="country-label"
          id="country"
          value={selectedCountry}
          onChange={handleCountryChange}
          label="Country"
        >
          {Object.keys(countries).map((countryCode) => (
            <MenuItem key={countryCode} value={countryCode}>
              {countries[countryCode].name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="state-label">State</InputLabel>
        <Select
          labelId="state-label"
          id="state"
          value={selectedState}
          onChange={handleStateChange}
          label="State"
        >
          {Object.keys(states).map((stateCode) => (
            <MenuItem key={stateCode} value={stateCode}>
              {states[stateCode].name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="city-label">City</InputLabel>
        <Select
          labelId="city-label"
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          label="City"
        >
          {cities.map((city, index) => (
            <MenuItem key={index} value={city.name}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>
      
    </div>
  );
}
