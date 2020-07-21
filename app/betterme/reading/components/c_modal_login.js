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
  }

  componentDidMount()
  {
    setTimeout(() => this.hide(), this.props.timeout || 2000);
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
      <CModal style={{backgroundColor: "rgba(0,0,0,0.2)"}} showCloseBtn={true}>
            <CSignin></CSignin>
            asdfasdfa
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