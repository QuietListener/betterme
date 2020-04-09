import { combineReducers } from 'redux'
import {TEST} from "../actions/actions.js"

export function rtest(state = {}, action) {
    console.log("action",action);
    if(action.type == TEST)
    {
      return {text:action.text}
    }
    return state;
}



const reducers = combineReducers({
  rtest
})

export default reducers;