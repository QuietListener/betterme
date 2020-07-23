import * as base from "../../base.js"
import {axios} from "../../base.js"
import React, {Component} from 'react';
import Moment from "moment"
import css from "../css/ireading.css"
import readedPng from "../../../resource/imgs/readed.png"
import levelPng from "../../../resource/imgs/level.png"

import {connect} from "react-redux";
import {login, signin} from "../../redux/actions/actions"

const BaseHost = base.BaseHostIreading();

const LOGIN = 1;
const REGISTER = 2;
class CSignin_ extends Component
{
  constructor(props)
  {
    super(props);
    this.goto = this.goto.bind(this);
    this.loadImg = this.loadImg.bind(this);
    this.login_ = this.login_.bind(this);
    this.state={state:LOGIN}
    this.networkerror = this.networkerror.bind(this);
  }

  componentDidMount(){
    // this.loadImg();
  }

  loadImg(){
    
      var that = this;
      this.setState({loading: true});
  
      var id = this.state.id;
      axios.get(`${BaseHost}/reading/mini_captcha1.json`).then((res) => {
        console.log("res", res);
        that.setState({data: res.data});
        console.log(that.state);
        // that.load_plans(user.id)
      }).catch(e => {
        console.log(e);
        this.setState({loading: false});
      })
  }
  
  goto(a){
    if(a.parent_id ){
      base.goto(`/reading_page/${a.id}`)
    }else{
      base.goto(`/article_group/${a.id}`)
    }

  }

  async signin_(name,password,captcha,fileName){
    this.setState({errorMsg:null})
    await base.request("post",base.URLS.signin.url(),{user_name:name,password,captcha,fileName},(res)=>{
      console.log("login",res);
      if(res.status != 200 || !res.data || !res.data.user){
        
        let errorMsg = "注册失败";
        if(res.data && res.data.status<0){
          errorMsg = res.data.msg;
        }

        this.setState({errorMsg})
        return;
      }

      if(res && res.data && res.data.user){
        let accessToken = res.data.user.access_token;
        base.setCookie("access_token",accessToken);
      }

      if(this.props.loginCallBack){
        this.props.loginCallBack(res.data);
      }
      
    },
    (e)=>{
      console.log("res",e);
      this.networkerror();
    });
  }



  async login_(name,password){
    this.setState({errorMsg:null})
    let loginCallBack = this.props.loginCallBack;
    await base.request("post",base.URLS.login.url(),{user_name:name,password},(res)=>{
      console.log("login",res);
      if(res.status != 200 || !res.data || !res.data.user){
        this.setState({errorMsg:"登录失败!"})
        return;
      }
      if(res && res.data && res.data.user){
        let accessToken = res.data.user.access_token;
        base.setCookie("access_token",accessToken);
      }

      if(this.props.loginCallBack){
        this.props.loginCallBack(res.data);
      }
    },
    (e)=>{
      console.log("res",e);
      this.networkerror();
    });
  }

  networkerror(){
    this.setState({errorMsg:"网络有问题!"})
  }

  render()
  {
    let state = this.state.state;

    let errorMsg = this.state.errorMsg;

    let base64Img = "";
    let fileName= '';
    if(this.state.data){
        base64Img = this.state.data.img;
        fileName = this.state.data.code_flag;
    }
    return (
    <div style={{textAlign:"center"}}>

    <div style={{marginTop:"6px",textAlign:"center"}}>
        <div style={{width:"95px",color:base.COLOR.gray1,marginRight:"4px",display:"inline-block",borderBottom:`${state == LOGIN ? "1px solid":  ""}`}}
           onClick={()=>this.setState({state:LOGIN}) }>  登录</div>

           <div style={{color:base.COLOR.gray1,width:"95px",display:"inline-block",borderBottom:`${state == REGISTER ? "1px solid" :  ""}` }}
           onClick={()=>{ 
             this.setState({state:REGISTER}) ;
             if(this.state.data == null ){
              this.loadImg();}
           } }> 注册</div>
        </div>
   

      <div style={{textAlign:"center",marginTop:"12px",minWidth:"200px"}}>
         <div style={{textAlign:null,marginTop:"4px"}}>
          <input ref={"name"} placeholder="邮箱或者手机号码" style={inner_style.input} ></input>
          </div>

        <div style={{textAlign:null,marginTop:"4px"}}>
          <input ref={"password"} placeholder="密码" style={inner_style.input}  ></input>
          </div>

      {this.state.state == REGISTER ?
          <div style={{textAlign:"center",marginTop:"4px",minWidth:"200px"}}>
            <img src={"data:image/jpg;base64,"+base64Img} style={{height:"20px",width:"70px",display:"inline-block",verticalAlign:"top",marginRight:"4px"}}  onClick={this.loadImg}/>
            <input ref={"yzm"} placeholder="验证码" style={Object.assign({},inner_style.input,{width:"120px",height:""})}></input>
        </div>:null
      }

        <div style={{marginTop:"6px",textAlign:"center"}}>
        <button style={{width:"200px",marginRight:"4px",color:base.COLOR.gray1}} 
          onClick={()=>{
            
            let name = this.refs["name"].value;
            let password = this.refs["password"].value
            console.log("name,password",name,password);
            if(this.state.state == LOGIN){
               this.login_(name,password);
            }else{
              let yzm = this.refs["yzm"].value
              this.signin_(name,password,yzm,fileName);
            }
          }}> 提交</button>
        </div>

      </div>

      {errorMsg ? <div style={{fontSize:"10px",marginTop:"4px",color:"red"}}>
        {errorMsg}
      </div>: null}
    </div>
    )
  }
}


const inner_style = {
  input:{width:"200px",height:"26px",border:"1px solid "+base.COLOR.gray1},
  part: {display: "inline-block", verticalAlign: "top", width: "44%", fontSize: "10px"},
  box: {"padding": "2px", "margin": "4px"},
  btn: {display: "inline-block", verticalAlign: "top","padding": "2px", "margin": "4px",border:"1px solid"}
}


const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const CSignin = connect(mapStateToProps)(CSignin_)
export default  CSignin;