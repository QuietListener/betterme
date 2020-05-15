import {axios,URLS} from "../../base.js"

export const TEST = "test"
export const SET_DATA = "SetData"

export const CLEAR_ALL_DATA = "CLEAR_ALL_DATA";
export const UPDATE_DATA_STATE = "UPDATE_DATA_STATE"
export const UPDATE_DATA_STATUS = {
  LOADING:"LOADING",
  SUCCEED:"SUCCEED",
  FAILED:"FAILED",
  INIT:"INIT",
}


export function setSettingData(pair)
{
  return { type: SET_DATA, text:pair }
}

export function test(text)
{
  return { type: TEST, text }
}

async function fetch_data(dispatch,getState,key,url,func)
{
  console.log("fetch:",url);
  var state = getState();
  var state

  return await axios.get(url)
      .then(res => dispatch(func(res.data.data))
      );
}


export function update_data_state(name,url,status,data,e)
{
  return {
    type: UPDATE_DATA_STATE,
    text:{
      name,url,status,data,e
    }
  }
}


function update_state(state={},action)
{
  if(action.type == UPDATE_DATA_STATE)
  {
    var {name,url,status,data,e} = action.text;

    if(name == null)
    {
      console.error("update_state error",action);
      return state;
    }

    if(name == CLEAR_ALL_DATA)
    {
      return {};
    }

    if(state[name] == null)
    {
      state[name] = {};
    }

    if(status == UPDATE_DATA_STATUS.SUCCEED)
    {
      state[name] = {url,status,data,e}
    }
    else if(status == UPDATE_DATA_STATUS.FAILED || status == UPDATE_DATA_STATUS.LOADING )
    {
      state[name][`url`] = url;
      state[name][`status`] = status;
      state[name][`e`] = e;
    }
    else if(status == UPDATE_DATA_STATUS.INIT)
    {
      state[name] = {};
    }

    return Object.assign({},state);
  }

  return state;

}

async function return_get_data_func(type,dispatch,getState,call_back)
{
  var state = getState();
  //console.log("getState",state);
  console.log(`###action loading: ${type.name}`)

  if(state && state.update_state
      && state.update_state[type.name]
      && state.update_state[type.name] == UPDATE_DATA_STATUS.LOADING)
  {
    console.log(`loading: ${state.update_state[type.name].url()} is loading`)
    return;
  }

  dispatch(update_data_state(
      type.name,
      type.url(),
      UPDATE_DATA_STATUS.LOADING,null,null));

  try
  {
    var res3 = await axios({method: 'get', url: type.url()})
    let data = res3.data;
    let new_data = null;
    if (call_back)
    {
      new_data = call_back(data);
    }
    else
    {
      new_data = data;
    }

    dispatch(update_data_state(
        type.name,
        type.url(),
        UPDATE_DATA_STATUS.SUCCEED,
        new_data, null));
  }
  catch(e)
  {
    dispatch(update_data_state(
        type.name,
        type.url(),
        UPDATE_DATA_STATUS.FAILED, null, e));
  }

}


export function get_all_articles()
{
  console.log("all_articles");
  return function(dispatch,getState) {
    return_get_data_func(URLS.all_articles,dispatch,getState);
  }
}

export function get_all_finished_articles(){
  console.log("finished_articles");
  return function(dispatch,getState) {
    return_get_data_func(URLS.finished_articles,dispatch,getState);
  }
}