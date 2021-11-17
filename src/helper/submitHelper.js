import fetchHelper from './fetchHelper';

//type == form type (eg, register, login)
export default async function submitHelper(type, data) {

  switch(type){
    case 'register':
    {
      let status = await submitRegister(data);
      return status;
    }
    case 'login':
    {
      let status = await submitLogin(data);
      return status;
    }
    case 'auth':
    {
      let status = await submitAuth(data);
      return status;
    }
    case 'activateAuth':
    {
      let status = await submitActivateAuth(data);
      return status;
    }
    case 'list':
    {
      let status = await submitList(data);
      return status;
    }
    case 'listEdit':
    {
      let status = await submitListEdit(data);
      return status;
    }
    case 'deleteList':
    {
      let status = await deleteList(data);
      return status;
    }
    case 'task':
    {
      let status = await submitTask(data);
      return status;
    }
    case 'deleteTask':
    {
      let status = await deleteTask(data);
      return status;
    }
    case 'taskEdit':
    {
      let status = await submitTaskEdit(data);
      return status;
    }
    case 'updateTaskDone':
    {
      let status = await updateTaskDone(data);
      return status;
    }
  }
  return false;
}

function ValidateAllInput(obj, value) {
  for(var id in obj) {

    if(obj[id].OK == value) {
      return true;
    }
  }
  return false;
}

async function submitRegister(data){
  //Check in regInfo state object if find Ok that == false
  if(ValidateAllInput(data, false) == true){
    return {auth: false, message: 'Need to fill form correctly!'}
  }
  const dataVal = {
    username: data.username.val,
    firstname: data.firstname.val,
    lastname: data.lastname.val,
    email: data.email.val,
    password: data.password.val
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)
  }

  let result = await fetchHelper('/api/user/register', settings);

  return result;
}

async function submitLogin(data){
  //Check in regInfo state object if find Ok that == false
  if(ValidateAllInput(data, false) == true){
    return;
  }
  const dataVal = {
    username: data.username,
    password: data.password
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)
  }

  let result = await fetchHelper('/api/user/login', settings);

  return result;
}

async function submitAuth(data){

  const dataVal = {
    enteredAuthToken : data.auth,
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)

  }

  let result = await fetchHelper('/api/2fa/validate', settings);

  return result;
}

async function submitActivateAuth(data){

  const dataVal = {
    enteredAuthToken : data.auth,
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)

  }

  let result = await fetchHelper('/api/2fa/activate', settings);

  return result;
}

async function submitList(data){

  const dataVal = {
    listData : data,
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)

  }

  let result = await fetchHelper('/api/list/add', settings);

  return result;
}

async function submitTask(data){

  const dataVal = {
    listData : data,
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)

  }

  let result = await fetchHelper('/api/task/add', settings);

  return result;
}

async function submitTaskEdit(data){

  const dataVal = {
    editData : data,
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)

  }

  let result = await fetchHelper('/api/task/update', settings);

  return result;
}
async function submitListEdit(data){

  const dataVal = {
    editData : data,
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)

  }

  let result = await fetchHelper('/api/list/update', settings);

  return result;
}
async function deleteList(data){

  const dataVal = {
    actionData : data,
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)

  }

  let result = await fetchHelper('/api/list/delete', settings);

  return result;
}
async function deleteTask(data){

  const dataVal = {
    actionData : data,
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)

  }

  let result = await fetchHelper('/api/task/delete', settings);

  return result;
}
async function updateTaskDone(data){

  const dataVal = {
    actionData : data,
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)

  }

  let result = await fetchHelper('/api/task/done', settings);

  return result;
}