import React,{Component} from 'react';
import {render} from 'react-dom';
import Home from './betterme/home.js'
import PlanDetails from "./betterme/plan_details.js"

import './css/main.css'

import { Router, Route, hashHistory } from 'react-router';
import { createStore,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from "./betterme/redux/reducers/reducers.js"

// Logger with default options
import logger from 'redux-logger'
const store = createStore(
  reducers,
  applyMiddleware(logger)
)

class App extends Component
{
  render()
  {
    return (<Provider store={store}>
      <Router  history={hashHistory} >
          <Route path="/" component={Home}></Route>
          <Route path="/plan_details" component={PlanDetails} />
        </Router>
    </Provider>)
  }
}

render(<App/>,document.getElementById('root'));