import fetchHelper from './fetchHelper';
export default async function checkAccess(data){
  const dataVal = {
    path: data
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)
  }

  let result = await fetchHelper('/api/auth/access', settings);

  return result;
}