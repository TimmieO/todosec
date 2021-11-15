import React, { useState, useEffect } from "react";
import submitHelper from "../../helper/submitHelper";
import checkAccess from "../../helper/userHasAccess"
import fetchPageData from "../../helper/fetchPageDataHelper"
export default function Admin() {

  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let data = await fetchPageData(window.location.pathname);
    setFetchedData(data.info)
    console.log(fetchedData);
  }

  /*

   */
  return (
    <div className="body">
      {console.log(fetchedData)}
      <h1>Admin page</h1>
      <table className="admin-table">
        <thead>
        <tr>
          <th>id</th>
          <th>username</th>
          <th>email</th>
        </tr>
        </thead>
      {fetchedData.map((user, index) => (
        <tbody>
        <tr>
          <td>{user.user_id}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
        </tr>
        </tbody>
      ))}
      </table>
    </div>
  );
}