import React, {Component} from 'react';
import crossPng from "../../../resource/imgs/cross.png"

export default class CModal extends Component{

  constructor(props)
  {
    super(props)
  }


  render()
  {

    return (
      <div style={Object.assign({position:"fixed",top:0,left:0,zIndex:1000,
        width:"100%",height:"100%",textAlign:"center",color:"black",
        backgroundColor:"white"},this.props.style)}>
        <div style={{position:"fixed",top:0,right:0}} onClick={this.props.close}>
          <img   src={crossPng} width={18} style={{margin:"4px"}}></img>
        </div>
        {this.props.children}
      </div>
    );
  }

}
