import React, { useState, useEffect } from "react";
import submitHelper from "../../helper/submitHelper";
import checkAccess from "../../helper/userHasAccess"
import performAction from "../../helper/perfAction"
import fetchPageData from "../../helper/fetchPageDataHelper"
import { AiFillEdit, AiFillDelete, AiOutlineClose, AiOutlineCheck } from "react-icons/ai"
import "./admin.css";

export default function Admin() {

  const [fetchedData, setFetchedData] = useState([]);

  const [activeRowEdit, setActiveRowEdit] = useState();
  const [editData, setEditData] = useState({username: null, firstname: null, lastname: null, email: null, level: null, });

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let data = await fetchPageData(window.location.pathname);
    setFetchedData(data.info)
  }

  const editTableRow = async(rowId, action) => {

    switch(action){
      case "start":
      {
        startEdit(rowId);
        break;
      }
      case "cancel":
      {
        cancelEdit(rowId);
        break;
      }
      case "submit":
      {
        submitEdit(rowId);
        break;
      }
    }

    //Finish this
    function startEdit(rowId){
      setActiveRowEdit(rowId)
      setEditData(fetchedData[rowId])
    }
    function cancelEdit(rowId){
      setActiveRowEdit(null)
    }
    async function submitEdit(rowId){
      performAction(editData, "update");

      setActiveRowEdit(null)
      setEditData({username: null, firstname: null, lastname: null, email: null, level: null })
      window.location.reload();
    }
  }

  //Change text in state onChange
  const onChangeUpdateStateText = async (e) => {
    let inpType = e.target.dataset.input;
    let inpVal = e.target.value;
    setEditData((prevState) => ({
      ...prevState,
      [inpType]: inpVal,
    }));
  };

  const removeUser = async(userId) => {
    await performAction(userId, "delete");

  }

  return (
    <div className="body">
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
          <tr className={activeRowEdit == index ? "hidden" : null}>
            <td>{user.user_id}</td>
            <td>{user.username}</td>
            <td>{user.firstname}</td>
            <td>{user.lastname}</td>
            <td>{user.email}</td>
            <td>{user.access_level}</td>
            <td>
              <AiFillEdit className="admin-table-action-icon" onClick={() => editTableRow(index, "start")}/>
              <AiFillDelete className="admin-table-action-icon" onClick={() => removeUser(user.user_id)}/>
            </td>
          </tr>
          <tr className={activeRowEdit == index ? null : "hidden"}>
            <td>{user.user_id}</td>
            <td><input type="text" data-input="username" value={editData.username} onChange={onChangeUpdateStateText} /></td>
            <td><input type="text" data-input="firstname" value={editData.firstname} onChange={onChangeUpdateStateText} /></td>
            <td><input type="text" data-input="lastname" value={editData.lastname} onChange={onChangeUpdateStateText} /></td>
            <td><input type="text" data-input="email" value={editData.email} onChange={onChangeUpdateStateText} /></td>
            <td><input type="text" data-input="access_level" value={editData.access_level} onChange={onChangeUpdateStateText} /></td>
            <td>
              <AiOutlineCheck className="admin-table-action-icon" onClick={() => editTableRow(index, "submit")}/>
              <AiOutlineClose className="admin-table-action-icon" onClick={() => editTableRow(index, "cancel")}/>
            </td>
          </tr>
        </tbody>
      ))}
      </table>
    </div>
  );
}