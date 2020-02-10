import React, {Component} from 'react';
import config from '../conf/config.json';
import * as base from "./base.js"
import _ from "lodash"
import  '../css/app.css';
import {axios} from "./base.js"


const BaseHost = "http://127.0.0.1:3100"


export default class Article extends Component{

  constructor(props)
  {
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
      //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    super(props);
    this.state={
      show_new_plan:null,
    };

    this.load = this.load.bind(this);

  }


  componentDidMount()
  {
      this.load();
  }


  load()
  {
    var that = this;
    this.setState({loading:true});

    axios.get(`${BaseHost}/reading/test.json?article_id=1`).then((res)=>{
      console.log("res",res);

      //that.setState({user:user});
      console.log(that.state);
     // that.load_plans(user.id)
    }).catch(e=>{
      console.log(e);
      this.setState({loading:false});
    })
  }

  render(){


    return (
      <div>
        hello world
      </div>
    )
  }
}

const inner_style = {
  input:{fontSize:"22px",minWidth:"120px",border:"0px",borderBottom:"1px solid #f2f2f2",marginTop:"10px"}
}