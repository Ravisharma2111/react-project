import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import firebase from "./firebase.js";
import { Button, Container, Row, Col, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";

const Signup = ({ handleAuth }) => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [mobileErr, setMobileErr] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/home");
    }
  }, []);
  const handleChange = (e) => {
    setMobile(e.target.value.replace(/[^0-9]+/g, ""));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value.replace(/[^0-9]+/g, ""));
  };

  const handleClick = () => {
    if (mobile.length < 10) {
      setMobileErr(true);
      return;
    } else {
      setMobileErr(false);
      
      var recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha");
      var number = `+91${mobile}`;
      firebase
        .auth()
        .signInWithPhoneNumber(number, recaptcha)
        .then(function (e) {
          setOtpSent(true);
          setVerificationId(e.verificationId);
            })
            .catch(function (error) {
              console.error(error);
            });     
    }
  };

  const handleVerifyOtp = () => {
    var credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      otp
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(function (result) {
        const phoneNumber = result.user.phoneNumber;
        if (result?.additionalUserInfo?.isNewUser) {
          const userName = prompt("Enter your name:");
          if (userName) {
            firebase.firestore().collection("users").doc(phoneNumber).set({
              name: userName,
              phoneNumber: phoneNumber
            })
            .then(() => {
              localStorage.setItem("isAuthenticated", "true");
              console.log("User authenticated. Redirecting to /home...");
              console.error("Error adding user to navigate: ");
              handleAuth();
              navigate("/home");

            })
            .catch((error) => {
              console.error("Error adding user to Firestore: ", error);
            });
          } else {
            console.error("User did not enter a name.");
          }
        } else {
          localStorage.setItem("isAuthenticated", "true");
          handleAuth();
          navigate("/home");
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  

  return (
    <div style={{backgroundColor: '#b3cccc',height: '592px'}}>
      <Container>
        <Row>
          <Col>
            <form style={{display: 'flex',flexDirection: 'column',alignItems: 'center',paddingTop: '50px'}}>
            <TextField
  hiddenLabel
  // id="filled-hidden-label-small"
  variant="filled"
  size="small"
  type="text"
                name="mobile"
                sx={{color:'red' }}
                placeholder='Enter Your Number'
                value={mobile}
                onChange={handleChange}
                maxLength="10"
/>
             
              {mobileErr ? (
                <span className="text-danger">Enter Valid Mobile Number</span>
              ) : (
                ""
              )}
          {!otpSent && <div  style={{paddingTop: '13px'}} id="recaptcha"></div>}
              {!otpSent && (
                <Button outline color="success" onClick={handleClick} style={{pointer:'cursor',  marginTop: '30px',width: '140px',borderRadius: '10px',height: '40px',fontWeight: '900',backgroundColor: '#293d3d',color: '#d1e0e0'}}>
                  Send OTP
                </Button>
              )}
              {otpSent && (
                <div style={{paddingTop:'20px',display:'flex',flexDirection:'column'}}>
                <TextField
                 className="shakes"
                    type="num"
                    name="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength="6"
                    placeholder="Enter OTP"
  hiddenLabel
  // id="filled-hidden-label-small"
  variant="filled"
  size="small"
/>
                 
                  <Button
                  style={{pointer:'cursor',  marginTop: '30px',borderRadius: '10px',height: '40px',fontWeight: '900',backgroundColor: '#293d3d',color: '#d1e0e0'}}
                    outline
                    color="success"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </Button>
                </div>
              )}
            </form>
          </Col>
          <Col>
          </Col>
        </Row>
      </Container>
      <label id="successAlert" className="text-success"></label>
    </div>
  );
};

export default Signup;
