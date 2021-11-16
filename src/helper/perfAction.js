import fetchHelper from './fetchHelper';
export default async function performAction(data, action){
  const dataVal = {
    val: data
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)
  }

  let result = await fetchHelper('/api/admin/' + action, settings);

  return result;
}