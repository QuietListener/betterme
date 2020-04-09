import { combineReducers } from 'redux'
import {TEST,Articles} from "../actions/actions.js"

export function rtest(state = {}, action) {
    console.log("action",action);
    if(action.type == TEST)
    {
      return {text:action.text}
    }
    return state;
}

export function reading(state = {}, action) {
    console.log("action",action);
    if(action.type == Articles) {
        state = Object.assign({},state);
        state[Articles] = action.payload;
    }
    return state;
}




const reducers = combineReducers({
    rtest,
    reading
})

export default reducers;