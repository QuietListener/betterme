import React, {Component} from 'react';
import CModal from "./c_modal";

export default class CToast extends Component
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

    if (this.state.show == false)
      return null;

    return (
      <CModal style={{backgroundColor: "rgba(0,0,0,0.2)"}} showCloseBtn={false}>
        <div style={{position: "relative", textAlign: "center", marginTop: "30%",}}>
          <div style={{
            position: "relative",
            display: "inline-block",
            backgroundColor: "white",
            borderRadius: "4px",
            textAlign: "center",
            verticalAlign: "middle",
            backgroundColor: "black",
            padding: "10px"
          }}>
            {this.props.children}
          </div>
        </div>
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