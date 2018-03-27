import React, {Component} from 'react';

export default class CLoading extends Component{

  constructor(props)
  {
    super(props)
    var plan = this.props.plan
  }


  render(){

    return <div style={{width:"100%",height:"200%",textAlign:"center",position:"absolute",zIndex:999,backgroundColor:"rgba(0,0,0,0.1)"}}>

      <div style={{textAlign:"center",marginTop:"200px",color:"white",fontSize:16}}>
        <img width="80" height="80" src={"http://www.coderlong.com/images/spinner_betterme.gif"}></img>
      </div>
    </div>
  }
}