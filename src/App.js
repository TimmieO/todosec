import React, { useEffect, useState } from "react";
import "./App.css";

import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Auth from "./components/auth_input/Auth";
import Header from "./components/header/Header";
import Admin from "./components/admin/Admin";
import List from "./components/list/List";
import "bootstrap/dist/css/bootstrap.min.css";

import checkAccess from "./helper/userHasAccess"

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {

  const [userHasAccess, setUserHasAccess] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accessCheck();
  }, [userHasAccess]);

  const accessCheck = async () => {
    let access = await checkAccess(window.location.pathname)
    setUserHasAccess(access.access)
    if(access.access == false && access.auth == false){
      window.location.href = "/auth";
    }
    else if(access.access == false){
      window.location.href = "/";
    }
    else if(access.access == true && access.path == window.location.pathname){
      setLoading(false)
    }
    else{
      window.location.href = "/";
    }
  };

  return (
    <Router>
      <div id="App">
        <Header />
        {loading ? "loading":
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/login" component={Login}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/auth" component={Auth}/>
            <Route exact path="/admin" component={Admin}/>
            <Route exact path="/list" component={List}/>
            <Route exact path="/logout"/>
          </Switch>
            }
      </div>
    </Router>
  );
}

export default App;