import * as base from "../../base.js"
import {axios} from "../../base.js"
import React, {Component} from 'react';
import Moment from "moment"
import css from "../css/ireading.css"
import readedPng from "../../../resource/imgs/readed.png"
import levelPng from "../../../resource/imgs/level.png"


export default class CSignin extends Component
{
  constructor(props)
  {
    super(props);
    this.goto = this.goto.bind(this);
    this.loadImg = this.loadImg.bind(this);
  }

  componentDidMount(){
    // this.loadImg();
  }

  loadImg(){
    var url = "https://freepic.store/reading/mini_captcha?t="+new Date().getTime();
    axios.get(url).then((res) => {
      console.log("res", res);
      
      let filename = res["header"]
          .get("content-disposition")
          .split('"')[1];
      
      console.log(filename);

    }).catch(e => {
      console.error(e);
    })
  }
  
  goto(a){
    if(a.parent_id ){
      base.goto(`/reading_page/${a.id}`)
    }else{
      base.goto(`/article_group/${a.id}`)
    }

  }

  render()
  {
    return (
    <div style={{}}>
      <div style={{textAlign:"center",marginTop:"4px",minWidth:"200px"}}>
         <div style={{textAlign:null,marginTop:"4px"}}>
          <input ref={"name"} placeholder="邮箱或者手机号码" style={{minWidth:"200px"}} ></input>
          </div>

        <div style={{textAlign:null,marginTop:"4px"}}>
          <input ref={"password"} placeholder="密码" style={{minWidth:"200px"}} ></input>
          </div>

        {/* <input ref={"yzm"}></input>
        <img src={""}></img> */}

        <div style={{marginTop:"6px",textAlign:"center"}}>
        <button style={{width:"95px",marginRight:"4px"}} 
          onClick={()=>{}}> 登录</button>

           <button style={{width:"95px"}}
          onClick={()=>{}}> 注册</button>
        </div>
   

      </div>
    </div>
    )
  }
}


const inner_style = {
  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top","padding": "2px", "margin": "4px",border:"1px solid"}
}