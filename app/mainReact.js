import React, {Component} from 'react';
import {render} from 'react-dom';

import Article from './betterme/reading/article.js'
import Articles from './betterme/reading/articles.js'
import ReadingPage from './betterme/reading/reading_page.js'
import Comment from "./betterme/reading/comment.js"
import ArticleGroup from "./betterme/reading/article_group.js"
import ArticlesChoosePage from "./betterme/reading/articles_choose_page.js"
import ReadingMinePage from "./betterme/reading/mine_page.js"
import ArticlesList from "./betterme/reading/articles_list.js"
import MainPageWithTab from "./betterme/reading/main_with_tab.js"
import CollectedWords from  "./betterme/reading/collected_words.js"
//
// import Home from './betterme/home.js'
// import PlanDetails from "./betterme/plan_details.js"
// import NewPlan from "./betterme/new_plan.js"
// import Mine from "./betterme/mine.js"
// import Test from "./betterme/test.js"

import './css/main.css'

import {Router, Route, hashHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import {Provider} from 'react-redux'
import reducers from "./betterme/redux/reducers/reducers.js"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GreeterReact from "./GreeterReact.js"

// Logger with default options
import logger from 'redux-logger'

const store = createStore(
  reducers,
  applyMiddleware(thunk,logger)
)

class App extends Component
{
  render()
  {
    return (
      <MuiThemeProvider>
        <Provider store={store}>

          <Router history={hashHistory}>


            <Route path="/article/:id" component={Article}></Route>
            <Route path="/articles" component={Articles}></Route>

            <Route path="/" component={MainPageWithTab}></Route>
            <Route path="/reading_mine" component={ReadingMinePage}></Route>
            <Route path="/article_group/:id" component={ArticleGroup}></Route>
            <Route path="/reading_page/:id" component={ReadingPage}></Route>

            <Route path="/comment/:id" component={Comment}></Route>

            <Route path="/articles_choose_page" component={ArticlesChoosePage}></Route>
            <Route path="/article_list" component={ArticlesList}></Route>
            <Route path="/collected_words" component={CollectedWords}></Route>
            
            {/*/!*<Route path="/" component={Home}></Route>*!/*/}
            {/*<Route path="/mine" component={Mine}/>*/}
            {/*<Route path="/plan_details/:id" component={PlanDetails}/>*/}
            {/*<Route path="/new_plan/:id" component={NewPlan}/>*/}
            {/*<Route path="/test" component={Test}/>*/}
            {/*<Route path="/greeter" component={GreeterReact}/>*/}
          </Router>
        </Provider>
      </MuiThemeProvider>)
  }
}

render(<App/>, document.getElementById('root'));