import React, { useState, useEffect } from "react";
import "./login.css";
import submitHelper from "../../helper/submitHelper";
import checkAccess from "../../helper/userHasAccess"

export default function Login() {
  const [loginInfo, setLoginInfo] = useState({
    username: null,
    password: null,
  });

  const [statusText, setStatusText] = useState(null);

  //Change text in state onChange
  const onChangeUpdateStateText = async (e) => {
    let inpType = e.target.dataset.input;
    let inpVal = e.target.value;
    setLoginInfo((prevState) => ({
      ...prevState,
      [inpType]: inpVal,
    }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();

    let status = await submitHelper("login", loginInfo);

    //Logged in
    if (status.valid == true) {
      window.location.href = "/"; //Return user to home page
    }
    //Wrong info
    if (status.valid == false) {
      setStatusText(status.message)
    }
  };

  return (
    <div className="body">
      <div className="div-form">
        <form action="" className="form">
          <h1 className="form_title">Sign In</h1>
          {statusText != null ? <p style={{color: 'red'}}>{statusText}</p> : null }
          <div className="form_div">
            <input
              type="text"
              className="form_input"
              data-input="username"
              placeholder=""
              onChange={onChangeUpdateStateText}
            />
            <label className="form_label">Username</label>
          </div>
          <div className="form_div">
            <input
              type="password"
              className="form_input"
              data-input="password"
              placeholder=""
              onChange={onChangeUpdateStateText}
            />
            <label className="form_label">Password</label>
          </div>
          <input
            type="submit"
            className="form_button"
            value="Sign In"
            onClick={submitLogin}
          />
        </form>
        <div id="navLink">
          <p onClick={() => window.location.href = "/register"} className="reg_button">
            Sign up
          </p>
        </div>
      </div>
    </div>
  );
}