import React, {Component} from 'react';

export default class CModal extends Component{

  constructor(props)
  {
    super(props)
  }


  render()
  {

    return (
      <div style={Object.assign({position:"absolute",top:0,left:0,zIndex:1000,
        width:"100%",height:"100%",textAlign:"center",color:"white",
        backgroundColor:"rgba(0,0,0,0.5)"},this.props.style)}>
        {this.props.children}
      </div>
    );
  }

}
