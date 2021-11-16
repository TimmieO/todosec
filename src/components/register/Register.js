import React, {useState, useEffect} from "react";
import "./register.css";

import RegValidation from './regValidation'
import submitHelper from '../../helper/submitHelper'
import checkAccess from "../../helper/userHasAccess"

export default function RegisterPage() {

  const [regInfo, setRegInfo] = useState({username:{val: null, OK: false}, firstname: {val: null, OK: false}, lastname:{val: null, OK: false}, email:{val: null, OK: false}, password:{val: null, OK: false}, repassword:{val: null, OK: false}})

 /*
  const [userHasAccess, setUserHasAccess] = useState()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accessCheck();
  }, [userHasAccess]);

  const accessCheck = async () => {
    let access = await checkAccess(window.location.pathname)
    setUserHasAccess(access)
    if(access.access == false){
      window.location.href = "/";
    }
    else if(access.auth != undefined && access.auth == false){
      window.location.href = "/auth";
    }
    else if(access.access == true && access.path == window.location.pathname){
      setLoading(false)
    }
    else{
      window.location.href = "/";
    }
  };

*/

  //Check data onBlur
  const regDataCheck = async(e) => {
    let inpType = e.target.dataset.input;
    let inpVal = e.target.value;
    let compVal = null;

    if(inpType == 'repassword'){
      compVal = regInfo['password'].val;
    }
    if(inpType == 'password'){
      compVal = regInfo['repassword'].val;
    }

    //Get return value from helper
    let result = await RegValidation({inpVal: inpVal, inpType: inpType, compVal: compVal});

    //Manage response from helper
    if(result.OK == false){
      e.target.style.borderColor = 'red';
      setRegInfo((prevState) => ({
        ...prevState,
        [inpType]: {
          ...prevState[inpType],
          OK: result.OK,
        }
      }));
    }
    if(result.OK == true){
      e.target.style.borderColor = 'green';
      setRegInfo((prevState) => ({
        ...prevState,
        [inpType]: {
          ...prevState[inpType],
          OK: result.OK,
        }
      }));

    }
  }

  //Change text in state onChange
  const onChangeUpdateStateText = async(e) => {
    let inpType = e.target.dataset.input;
    let inpVal = e.target.value;

    setRegInfo((prevState) => ({
      ...prevState,
      [inpType]: {
        ...prevState[inpType],
        val: inpVal,
      }
    }));
  }

  //Submit user on submit
  const submitRegister = async(event) => {

    event.target.disabled = true; //disable to not let user commit multiple times

    let status = await submitHelper('register', regInfo)

    //Registered
    if(status.error == false){
      window.location.href = '/'; //Redirect user to home page
    }
    //Something wrong
    if(status.error == true){
      event.preventDefault();
      event.target.disabled = false;
    }
  }

  return (
    <div className="body">
      <div className="div-form">
        <form action="" className="form">
          <h1 className="form_title">Sign Up</h1>
          <br/>
          <div className="form_div">
            <input type="text" className="form_input" data-input="username" onBlur={regDataCheck}
                   onChange={onChangeUpdateStateText}/>
            <label className="form_label">Username</label>
          </div>
          <div className="form_div">
            <input type="text" className="form_input" data-input="firstname" placeholder="" onBlur={regDataCheck}
                   onChange={onChangeUpdateStateText}/>
            <label className="form_label">First name</label>
          </div>
          <div className="form_div">
            <input type="text" className="form_input" data-input="lastname" placeholder="" onBlur={regDataCheck}
                   onChange={onChangeUpdateStateText}/>
            <label className="form_label">Last name</label>
          </div>
          <div className="form_div">
            <input type="text" className="form_input" data-input="email" placeholder="" onBlur={regDataCheck}
                   onChange={onChangeUpdateStateText}/>
            <label className="form_label">Email</label>
          </div>
          <div className="form_div">
            <input type="password" className="form_input" data-input="password" placeholder="" onBlur={regDataCheck}
                   onChange={onChangeUpdateStateText}/>
            <label className="form_label">Password</label>
          </div>
          <div className="form_div">
            <input type="password" className="form_input" data-input="repassword" placeholder="" onBlur={regDataCheck}
                   onChange={onChangeUpdateStateText}/>
            <label className="form_label">Re-Enter password</label>
          </div>

          <input type="submit" className="form_button" value="Sign Up" onClick={(event) => submitRegister(event)}/>
        </form>
      </div>
    </div>
  );
}