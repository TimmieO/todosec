import React, { useState, useEffect } from "react";
import submitHelper from "../../helper/submitHelper";
import checkAccess from "../../helper/userHasAccess"
import fetchPageData from "../../helper/fetchPageDataHelper"
import { AiOutlinePlusCircle, AiFillDelete, AiOutlineClose, AiOutlineCheck, AiFillEdit } from "react-icons/ai"

import "./list.css";

export default function List() {
  const [listInfo, setListInfo] = useState({
    title: null,
    color: 'gray',
  });
  const [taskInfo, setTaskInfo] = useState({
    title: null,
    list_id: null
  });

  const [fetchedList, setFetchedList] = useState([]);
  const [fetchedTask, setFetchedTask] = useState([]);
  const [addTodo, setAddTodo] = useState(false);
  const [addTaskItem, setAddTaskItem] = useState(false);

  const [activeEdit, setActiveEdit] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editList, setEditList] = useState(null);
  const [editData, setEditData] = useState();

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    let data = await fetchPageData(window.location.pathname);
    setFetchedList(data.retObj.list)
    setFetchedTask(data.retObj.task)
  }

  //Handlers for list and tasks
  const handleList = async(action, req_id) => {

    switch(action){
      case "create":
      {
        displayCreate();
        break;
      }
      case "submitList":
      {
        submitList();
        break;
      }
      case "cancelCreate":
      {
        cancelCreate();
        break;
      }
      case "edit":
      {
        startEditList(req_id);
        break;
      }
      case "cancelEdit":
      {
        cancelEditList();
        break;
      }
      case "submitEdit":
      {
        submitEditList();
        break;
      }
      case "deleteList":
      {
        deleteList(req_id)
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
        window.location.reload();
      }
    }
    function cancelCreate(){
      setAddTodo(false)
    }
    function startEditList(req_id){
      if(activeEdit){
        if(editTask != null){
          setEditTask(null);
        }
        if(editList != null){
          setEditList(null);
        }
      }
      setEditData({title: fetchedList[req_id].title, list_id: fetchedList[req_id].id})
      setEditList(req_id);
      setActiveEdit(true);
    }
    function cancelEditList(req_id){
      setActiveEdit(false);
      setEditList(null);
      setEditData({title: null})
    }
    async function submitEditList(){
      await submitHelper("listEdit", editData);

      setActiveEdit(false);
      setEditTask(null);
      setEditData({title: null})
      window.location.reload();
    }
    async function deleteList(req_id){
      await submitHelper("deleteList", fetchedList[req_id].id);

      window.location.reload();
    }

  }
  const handleTask = async(action, req_id) => {
    switch(action){
      case "create":
      {
        displayCreate(req_id);
        break;
      }
      case "cancelCreate":
      {
        cancelCreate();
       break;
      }
      case "submitTask":
      {
        submitTask();
        break;
      }
      case "edit":
      {
        startEditTask(req_id);
        break;
      }
      case "cancelEdit":
      {
        cancelEditTask(req_id);
        break;
      }
      case "submitEdit":
      {
        submitEditTask();
        break;
      }
      case "deleteTask":
      {
        deleteTask(req_id)
        break;
      }
      case "check":
      {
        updateCheck(req_id);
        break;
      }
    }

    function displayCreate(){
      setAddTaskItem(req_id)
    }
    async function submitTask(){
      taskInfo.list_id = fetchedList[req_id].id;
      let status = await submitHelper('task', taskInfo)
      if(status.success == true){
        setAddTaskItem(null);
        window.location.reload();
      }
    }
    function cancelCreate(){
      setAddTaskItem(null)
    }
    function startEditTask(req_id){
      if(activeEdit){
        if(editTask != null){
          setEditTask(null);
        }
        if(editList != null){
          setEditList(null);
        }
      }
      setEditData({title: fetchedTask[req_id].title, task_id: fetchedTask[req_id].id})
      setEditTask(req_id)
      setActiveEdit(true);
    }
    function cancelEditTask(req_id){
      setActiveEdit(false);
      setEditTask(null);
      setEditData({title: null})
    }
    async function submitEditTask(){
      await submitHelper("taskEdit", editData);

      setActiveEdit(false);
      setEditTask(null);
      setEditData({title: null})
      window.location.reload();
    }
    async function deleteTask(req_id){
      await submitHelper("deleteTask", fetchedTask[req_id].id);

      window.location.reload();
    }
    async function updateCheck(req_id){
      let data = {newVal : null, task_id: fetchedTask[req_id].id}
      let checkVal = fetchedTask[req_id].done;
      if(checkVal == 0) data.newVal = 1;
      if(checkVal == 1) data.newVal = 0;

      await submitHelper("updateTaskDone", data);
      window.location.reload();
    }

  }

  //Change text in state onChange for list update
  const onChangeUpdateListText = async (e) => {
    let inpType = e.target.dataset.input;
    let inpVal = e.target.value;
    setListInfo((prevState) => ({
      ...prevState,
      [inpType]: inpVal,
    }));
  };
  //Change text in state onChange for task create or update
  const onChangeUpdateTaskText = async (e) => {
    let inpType = e.target.dataset.input;
    let inpVal = e.target.value;
    setTaskInfo((prevState) => ({
      ...prevState,
      [inpType]: inpVal,
    }));
  };
  //Change text in state onChange edit text field
  const onChangeUpdateEditData = async (e) => {
    let inpType = e.target.dataset.input;
    let inpVal = e.target.value;
    setEditData((prevState) => ({
      ...prevState,
      [inpType]: inpVal,
    }));
  };

  return (
    <div className="body">
      <div className="container-fluid">
        <div className="main-lists-header">
          <h1>Lists</h1>
          <AiOutlinePlusCircle className="add-list" onClick={() => handleList("create")}/>
        </div>
        <div className="main-lists-body">
          <div className="row">

            {fetchedList.map((list, index) => (
              <div key={index} className="todo-list col-2" style={{backgroundColor: list.bg_color}}>
                {editList != index ?
                <div className="todo-list-header">
                  <div className="todo-list-title">
                    <h1>{list.title}</h1>
                  </div>
                  <div className="todo-list-actions">
                    <AiFillEdit className="todo-title-edit" onClick={() => handleList("edit", index)}/>
                    <AiFillDelete className="remove-list" onClick={() => handleList("deleteList", index)}/>
                  </div>
                </div>
                :
                <div className="todo-list-header">
                  <div className="todo-list-title"><input type="text" data-input="title" value={editData.title}
                                                     onChange={onChangeUpdateEditData}/></div>
                  <div className="todo-list-actions">
                    <AiOutlineCheck onClick={() => handleList("submitEdit", index)}/>
                    <AiOutlineClose onClick={() => handleList("cancelEdit", index)}/>
                  </div>
                </div>
                }

                <div className="todo-list-body">
                  <div className="create-task">
                    <AiOutlinePlusCircle className="add-task-icon" onClick={() => {handleTask("create", index)}}/>
                  </div>

                  {addTaskItem == index ?
                    <div className="create-task-item col-2">
                      <div className="create-task-header"><p>Create Todo</p></div>
                      <div className="create-task-body">
                        <div className="task-title-input">
                          <input type="text" data-input="title" placeholder="" className="task-create-input" onChange={onChangeUpdateTaskText} />
                        </div>
                        <div className="create-task-actions">
                          <AiOutlineCheck onClick={() => handleTask("submitTask", index)}/>
                          <AiOutlineClose onClick={() => handleTask("cancelCreate", index)}/>
                        </div>
                      </div>

                    </div>
                    :
                    null
                  }

                  {fetchedTask.map((task, index) => (
                    task.list_id == list.id ?
                      editTask != index ?
                        <div className="task" key={index} style={{backgroundColor: task.done == 0 ? "gray" : "green"}}>
                          <div className="task-body">
                            <div className="task-title"><h5>{task.title}</h5></div>
                            <div className="task-actions">
                              <input type="checkbox" defaultChecked={task.done == 0 ? false : true} onChange={() => handleTask("check", index)}/>
                              <AiFillEdit onClick={() => handleTask('edit', index)}/>
                              <AiFillDelete onClick={() => handleTask('deleteTask', index)}/>
                            </div>
                          </div>
                        </div>
                        :
                        <div className="task" key={index} style={{backgroundColor: "black"}}>
                          <div className="task-body">
                            <div className="task-title"><input type="text" data-input="title" value={editData.title}
                                                               onChange={onChangeUpdateEditData}/></div>
                            <div className="task-actions">
                              <AiOutlineCheck onClick={() => handleTask("submitEdit", index)}/>
                              <AiOutlineClose onClick={() => handleTask("cancelEdit", index)}/>
                            </div>
                          </div>
                        </div>
                    :
                    null
                  ))}
                </div>
              </div>
            ))}

            {addTodo ?
              <div className="create-todo col-2">
                <div className="create-todo-header"><h3>Create Todo</h3></div>
                <div className="create-todo-body">
                  <div className="todo-title-input">
                    <input type="text" data-input="title" placeholder="" onChange={onChangeUpdateListText} />
                  </div>
                  <div className="create-todo-actions">
                    <AiOutlineCheck onClick={() => handleList("submitList")}/>
                    <AiOutlineClose onClick={() => handleList("cancelCreate")}/>
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