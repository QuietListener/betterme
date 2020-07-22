import React, {Component} from 'react';
import CModal from "./c_modal";
import CSignin from './c_sigin';
import {connect} from "react-redux";
import * as base from "../../base.js"


class CModalLogin_ extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      show: true,
      loginSucceed:false
    }

    this.hide = this.hide.bind(this);
    this.loginCallBack = this.loginCallBack.bind(this);
  }

  componentDidMount()
  {
  
  }


  hide()
  {
    if (this.props.hide)
      this.props.hide();

    this.setState({show: false});
  }


  loginCallBack(data){
    if(data && data.user && data.user.access_token){
      this.setState({loginSucceed:true})
      // setTimeout(()=>{
      //   this.hide();
      // },1000);
    }

    if(this.props.loginCallBack){
      this.props.loginCallBack(data);
    }
  }


  render()
  {
    // if (this.state.show == false)
    //   return null;

    return (
      <CModal style={{backgroundColor: "rgba(255,255,255,0.98)"}} close={this.hide} showCloseBtn={true}>
        <div style={{marginTop:"20px",marginBottom:"40px"}}>
          <p style={{color:base.COLOR.gray1, fontSize: "16px"}}>登录才能继续操作喔</p>
        </div>

       {this.state.loginSucceed ?
        <div style={{fontSize:"18px"}}>
          登录成功!
        </div>
        :
       <CSignin loginCallBack={this.loginCallBack} style={this.props.style}></CSignin>
       } 
       
          
      </CModal>
    );
  }
}


const customContentStyle = {
  width: '90%',
  height: '90%',
  maxHeight: 'none',
  maxWidth: 'none',
};

const imgStyle = {
  border: "1px solid #f2f2f2",
  borderRadius: "2px"
}


const mapStateToProps = state => {
  return {
    redux_data: state,
  }
}
const CModalLogin = connect(mapStateToProps)(CModalLogin_)
export default  CModalLogin;