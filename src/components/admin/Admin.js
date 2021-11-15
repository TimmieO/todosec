import React, { useState, useEffect } from "react";
import submitHelper from "../../helper/submitHelper";
import checkAccess from "../../helper/userHasAccess"
import performAction from "../../helper/perfAction"
import fetchPageData from "../../helper/fetchPageDataHelper"
import { AiFillEdit, AiFillDelete } from "react-icons/ai"
import "./admin.css";

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

  const editTableRow = async(rowId) => {
    console.log(rowId);
  }

  const removeUser = async(userId) => {
    console.log(userId);
    let status = await performAction(userId, "delete");
    console.log(performAction(status))
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
            <th>firstname</th>
            <th>lastname</th>
            <th>email</th>
            <th>level</th>
            <th>Action</th>
          </tr>
        </thead>
      {fetchedData.map((user, index) => (
        <tbody>
          <tr>
            <td>{user.user_id}</td>
            <td>{user.username}</td>
            <td>{user.firstname}</td>
            <td>{user.lastname}</td>
            <td>{user.email}</td>
            <td>{user.access_level}</td>
            <td>
              <AiFillEdit onClick={() => editTableRow(index)}/>
              <AiFillDelete onClick={() => removeUser(user.user_id)}/>
            </td>
          </tr>
        </tbody>
      ))}
      </table>
    </div>
  );
}