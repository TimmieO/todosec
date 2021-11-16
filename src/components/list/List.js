import React, { useState, useEffect } from "react";
import submitHelper from "../../helper/submitHelper";
import checkAccess from "../../helper/userHasAccess"
import fetchPageData from "../../helper/fetchPageDataHelper"
import { AiOutlinePlusCircle, AiOutlineClose, AiOutlineCheck, AiFillEdit } from "react-icons/ai"

import "./list.css";

export default function List() {
  const [listInfo, setListInfo] = useState({
    title: null,
    color: 'gray',
  });

  const [fetchedData, setFetchedData] = useState([]);
  const [addTodo, setAddTodo] = useState(false);

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let data = await fetchPageData(window.location.pathname);
    setFetchedData(data.info)
    console.log(data);
  }

  const addList = async(action) => {

    switch(action){
      case "start":
      {
        displayCreate();
        break;
      }
      case "submit":
      {
        submitList();
        break;
      }
      case "cancel":
      {
        cancelCreate();
        break;
      }
    }

    function displayCreate(){
      setAddTodo(true)
    }
    async function submitList(){
      let status = await submitHelper('list', listInfo)
      if(status.success == true){
        setAddTodo(false);
      }
    }
    function cancelCreate(){
      setAddTodo(false)
    }
  }

  //Change text in state onChange
  const onChangeUpdateStateText = async (e) => {
    let inpType = e.target.dataset.input;
    let inpVal = e.target.value;
    setListInfo((prevState) => ({
      ...prevState,
      [inpType]: inpVal,
    }));
  };

  return (
    <div className="body">
      <div className="container-fluid">
        <div className="main-lists-header">
          <h1>Lists</h1>
          <AiOutlinePlusCircle className="add-list" onClick={() => addList("start")}/>
        </div>
        <div className="main-lists-body">
          <div className="row">

            {fetchedData.map((list, index) => (
              <div key={index} className="todo-list col-2" style={{backgroundColor: list.bg_color}}>

                <div className="todo-list-header">
                  <h1>{list.title}</h1>
                  <AiFillEdit/>
                  <AiOutlineClose className="remove-list"/>
                </div>

              </div>
            ))}

            {addTodo ?
              <div className="create-todo col-2">
                <div className="create-todo-header"><h3>Create Todo</h3></div>
                <div className="create-todo-body">
                  <div className="todo-title-input">
                    <input type="text" data-input="title" placeholder="" onChange={onChangeUpdateStateText} />
                  </div>
                  <div className="create-todo-actions">
                    <AiOutlineCheck onClick={() => addList("submit")}/>
                    <AiOutlineClose onClick={() => addList("cancel")}/>
                  </div>
                </div>
              </div>
            :
              null
            }
          </div>
        </div>
      </div>
    </div>
  );
}