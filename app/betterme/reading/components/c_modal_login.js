import React, {Component} from 'react';
import CModal from "./c_modal";
import CSignin from './c_sigin';
import {connect} from "react-redux";


class CModalLogin_ extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      show: true
    }

    this.hide = this.hide.bind(this);
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


  render()
  {
    // if (this.state.show == false)
    //   return null;

    return (
      <CModal style={{backgroundColor: "white"}} close={this.hide} showCloseBtn={true}>
        <div style={{marginTop:"20px",marginBottom:"40px"}}>
          <p>登录才能继续操作喔</p>
        </div>

       <CSignin></CSignin>
          
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