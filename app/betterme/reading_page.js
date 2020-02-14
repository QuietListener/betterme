import React, {Component} from 'react';
import config from '../conf/config.json';
import * as base from "./base.js"
import _ from "lodash"
import '../css/app.css';
import {axios} from "./base.js"


const BaseHost = "http://localhost:3100"


export default class ReadingPage extends Component
{

  constructor(props)
  {
    super(props)
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];

    var id = this.props.params.id;
    console.log("id",id);

    this.state = {
      id: id,
      data: {},
      start: -1,
      end: -1,
      which: "start",
      audio_splits: []
    };

    this.load = this.load.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.audioRef = new Object();

    this.timeoutPlay = null;
  }

  componentDidMount()
  {
    this.load();
    document.addEventListener("keydown", this.onKeyDown)
  }



  load()
  {
    var that = this;
    this.setState({loading: true});

    var id = this.state.id;
    axios.get(`${BaseHost}/reading/get_article_data.json?article_id=${id}`).then((res) => {
      console.log("res", res);
      that.setState({data: res.data.data});
      console.log(that.state);
      // that.load_plans(user.id)
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
    })
  }




  handleChange(propName, event)
  {
    let data = {}
    data[propName] = event.target.value;
    this.setState(data);
  }




  render()
  {

    return (

      <div style={{}}>

         hello
      </div>
    );
  }
}

const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"}
}