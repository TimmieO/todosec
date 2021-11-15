import fetchHelper from './fetchHelper';
export default async function isLoggedIn(){
  let result = await fetchHelper('/api/');

  return result;
}