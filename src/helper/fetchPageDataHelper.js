import fetchHelper from './fetchHelper';
export default async function fetchPageData(data){
  const dataVal = {
    path: data
  }

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataVal)
  }

  let fetchPath = data.substring(1);

  let result = await fetchHelper('/api/fetchData/' + fetchPath, settings);

  return result;
}