import React, {Component} from 'react';

export default class CLoading extends Component{

  constructor(props)
  {
    super(props)
    var plan = this.props.plan
  }


  render(){

    return <div style={{width:"100%",height:"200%",textAlign:"center",position:"absolute",zIndex:1024,backgroundColor:"rgba(0,0,0,0.1)"}}>
      <div style={{textAlign:"center",marginTop:"200px",color:"white",fontSize:16}}>
        <image src={"https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/mantpl/img/base/loading_72b1da62.gif"} />
      </div>
    </div>
  }
}