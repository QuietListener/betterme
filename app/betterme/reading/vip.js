import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CCalendar from "./components/c_calendar.js"
import css from "./css/ireading.css"


const BaseHost = base.BaseHostIreading();
import Moment from "moment"
import CSeperator from "./components/c_sperator";
import stopPng from "../../resource/imgs/stop.png";
import playPng from "../../resource/imgs/play.png";
import arrayLeftPng from "../../resource/imgs/array_left.png"
import arrayRightPng from "../../resource/imgs/array_right.png"
import CShareContent from "./components/c_share_content";
import CSignin from "./components/c_sigin";
import {connect} from "react-redux";
import CLoading from './components/c_loading.js';
import { white } from 'material-ui/styles/colors';
import CModalLogin from "./components/c_modal_login";

class Vip_ extends Component
{

  constructor(props)
  {
    super(props);
    
    this.state = {loading:false,showLoginModal:false,buyViewShow:false}
    this.load = this.load.bind(this);
    this.openVip = this.openVip.bind(this);
    this.loginCallBack = this.loginCallBack.bind(this);
  }

  componentDidMount()
  {
    this.load();
  }

  load()
  {
    let access_token = base.getCookie("access_token");
    if(access_token && access_token.length > 0){
      var that = this;
      this.setState({loading: true});

      var id = this.state.id;
      axios.get(`${BaseHost}/reading/userInfo.json`).then((res) => {
        console.log("res", res);
        that.setState({data: res.data});
        console.log(that.state);
        // that.load_plans(user.id)
        this.setState({loading: false});
      }).catch(e => {
        console.log(e);
        this.setState({loading: false});
      })

    }
  }

  openVip(){
    let access_token = base.getAccessToken();
    console.log("accessToken",access_token);
    if(!access_token){
      this.setState({showLoginModal:true});
      return;
    }

    this.setState({buyViewShow:true});

    let data = this.state.data;
    let user = data && data['user'] ;
    if(!user){
        this.load();
    }

  }

  loginCallBack(data){
    if(data && data.user && data.user.access_token){
      this.setState({showLoginModal:false});
      this.load();
    }
  }

  render(){

    let width = base.width()*3/4;
     
    if(width < 260){
      width = 260;
    }

   let access_token = base.getCookie("access_token");

   let data = this.state.data;
   let user = data && data['user'] ? data['user'] : {};
   let name = user['name'];

   let showDiv = null;
   
   let loginModal = this.state.showLoginModal == true ? <CModalLogin loginCallBack={this.loginCallBack} hide={()=>this.setState({showLoginModal:false})}></CModalLogin> :null;

   let buyView = <div style={{width:`${width}px`,margin:"auto",color:base.COLOR.gray1,fontSize:"14px",background:"#f2f2f2",padding:"4px",marginTop:"8px",textAlign:"center",fontWeight:"bold"}}>
    
     <div>请微信扫下面收款码，付相应的金额</div>
     <div style={inner_style.tip}>在付款时候备注填写您的用户名</div>
     {name ? <div style={{color:"red",fontWeight:"bold",fontSize:"18px"}}>{name}</div>:''}
    <div>有任何问题请联系微信号<span style={inner_style.tip}>xxxx</span></div>
    <CSeperator></CSeperator>
     <div style={{fontSize:"10px",marginTop:"6px"}}>收款码</div>
     <img src="https://player.oxyry.com/static/media/weixin-pay-qrcode-any.b27a5a86.png"  style={{width:"100px"}}/>
   </div>

    return (
      <div style={{textAlign:"center"}}>

        {loginModal}
       
        <div style={{fontSize:"20px",color:base.COLOR.gray1,margin:"10px",marginTop:"20px"}}>会员专属权益</div>
        <div style={{backgroundColor:base.COLOR.gray1,textAlign:"left",width:`${width}px`,margin:"auto",padding:"8px",borderRadius:"4px",maginBottom:"10px"}}> 
         <p style={{fontSize:"16px",lineHeight:"2em",color:"white"}}>1.每天无限篇文章阅读 </p>  
         <p style={{fontSize:"16px",lineHeight:"2em",color:"white"}}>2.会员专享文章无限看 </p> 
         <p style={{fontSize:"16px",lineHeight:"2em",color:"white"}}>3.文章逐句翻译 </p>  
        </div>


        <div style={{width:`${width}px`,margin:"auto",marginTop:"10px"}}>
         <div style={inner_style.price}>
           <p style={{fontSize:"16px",color:base.COLOR.red}}>4元</p> 
           <p style={{fontSize:"10px",color:base.COLOR.red}}>(1个月会员)</p>
         </div> 

         <div style={inner_style.price}>
           <p style={{fontSize:"16px",color:base.COLOR.red}}>20元</p> 
           <p style={{fontSize:"10px",color:base.COLOR.red}}>(半年会员)</p>
         </div> 
         <div style={inner_style.price}>
           <p style={{fontSize:"16px",color:base.COLOR.red}}>38元</p> 
           <p style={{fontSize:"10px",color:base.COLOR.red}}>(1年会员)</p>
         </div> 
        </div>

        {this.state.buyViewShow == true ? buyView : null}

        <div style={{width:`${width}px`,margin:"auto",marginTop:"10px",background:base.COLOR.red,padding:"4px",borderRadius:"4px",color:"white"}}
             onClick={this.openVip}
        > 开通会员 </div>


        <div style={{textAlign:"center",margin:"30px"}}>
          {showDiv}
        </div>  

        <img src="https://player.oxyry.com/static/media/weixin-pay-qrcode-any.b27a5a86.png"  style={{width:"1px",height:"1px"}}/>
      </div>
    );
  }
}

const inner_style = {
  price:{fontSize:"14px",color:base.COLOR.red,border:`1px solid ${base.COLOR.red}`,margin:"4px", display:"inline-block", verticalAlign:"top",padding:"4px",borderRadius:"4px"},
  tip:{
    color:base.COLOR.red,
    fontWeight:"bold"
  }

}

const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const Vip = connect(mapStateToProps)(Vip_)
export default Vip;