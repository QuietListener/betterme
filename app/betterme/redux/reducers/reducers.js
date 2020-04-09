import { combineReducers } from 'redux'
import {TEST, CLEAR_ALL_DATA,UPDATE_DATA_STATE,UPDATE_DATA_STATUS} from "../actions/actions.js"

export function rtest(state = {}, action) {
    console.log("action",action);
    if(action.type == TEST)
    {
      return {text:action.text}
    }
    return state;
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



const reducers = combineReducers({
    rtest,
    reading:update_state
})

export default reducers;