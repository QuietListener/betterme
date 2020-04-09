import {axios} from "../../base.js"

export const TEST = "test"
export const Articles = "Articles";

export function test(text)
{
  return { type: TEST, text }
}

function fetch_data(dispatch,url,func)
{
  console.log("fetch:",url);
  return axios.get(url)
      .then(res => dispatch(func(res.data.data))
      );
}


export function reveive_request(type,json)
{
  return {
    type:type,
    payload:json
  }
}

export function get_all_articles(url)
{
  return (dispatch,getState)=>{
    return dispatch(fetch_data(dispatch,url,(json)=>reveive_request(Articles,json)))
  }
}