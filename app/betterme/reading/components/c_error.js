import React, {Component} from 'react';
import errorPng from "../../../resource/imgs/error.png"

export default class CError extends Component
{
  constructor(props)
  {
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  refresh(){
    if(this.props.refresh){
      this.props.refresh();
    }
  }

  render()
  {

    return (
      <div>

        <div onClick={this.refresh} style={{textAlign:"center"}}
             style={{border: "1px solid red", borderRadius: "2px", fontSize: "12px", padding: "4px", margin: "0px"}}>
          <img alt="" src={errorPng} style={{height: "24px", display: "inline-block", verticalAlign: "top"}}></img>

          <div
            style={{display: "inline-block", verticalAlign: "top", marginTop: "4px"}}>Opps, click to refresh
          </div>
        </div>
      </div>
    )
  }
}
