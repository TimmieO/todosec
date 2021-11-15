import React, { useState, useEffect } from "react";
import submitHelper from "../../helper/submitHelper";
import checkAccess from "../../helper/userHasAccess"

export default function List() {
  const [loginInfo, setLoginInfo] = useState({
    username: null,
    password: null,
  });
  /*
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
*/

  return (
    <div className="body">
      <h1>Lists</h1>
    </div>
  );
}