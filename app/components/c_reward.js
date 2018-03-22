import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import * as base from "../betterme/base.js"
import Dialog from 'material-ui/Dialog';
import CModal from "./c_modal";

export default class CReward extends Component
{
  constructor(props)
  {
    super(props);
    this.state={
      score:0,
      step:0,
      msg:0,
    }

    this.get_reward = this.get_reward.bind(this);
    this.hide = this.hide.bind(this);
  }

  async get_reward()
  {
    this.setState({step:1})

    try{
      var res = await base.axios.get(`${base.BaseHost}/index/get_reward.json?lucky_token=${this.props.lucky_token}`);

      var reward = res.data;
      console.log("reward",res.data);

      setTimeout(()=>{
        if(reward && reward.data && reward.data.content)
        {
          this.setState({step:2,score:reward.data.content});
        }
        else
        {
          this.setState({step:2,});
        }
      },1000)

    }
    catch(e)
    {
      console.error(e);
      this.setState({step:2});
    }

  }

  hide()
  {
    if(this.props.hide)
      this.props.hide();
  }

  render()
  {

    var msg = "开"
    if(this.state.step == 0)
    {
      msg = "开"
    }
    else if(this.state.step == 1)
    {
      msg = "抽奖中..."
    }
    else
    {
      msg = this.state.score
    }

    var tip = "您获得一次抽奖机会"
    if(this.state.step == 2 && this.state.score > 0)
    {
      tip = "哇喔，您获得了~"
    }

    return(
        <CModal >
          <div style={{position:"relative",textAlign:"center",marginTop:"40%",}}>

            <div style={{position:"relative",display:"inline-block",width:"200px",height:"250px",backgroundColor:"white",borderRadius:"4px",textAlign:"center",verticalAlign:"middle",backgroundColor:base.COLOR.gray}}>

              <span style={{display:"inline-block",position:"absolute",top:4,right:6,color:"black",fontSize:16}}
                   onClick={this.hide}>x</span>

              <p style={{color:base.COLOR.red,paddingTop:"10px"}}>{tip}</p>

              <div style={{margin:"auto",backgroundColor:base.COLOR.red,width:120,height:120,borderRadius:60,verticalAlign:"middle",fontSize:30,marginTop:25,paddingTop:35}}
                  onClick={this.get_reward}
              >{msg}</div>

              <p style={{color:base.COLOR.red,paddingTop:"10px",marginTop:20}}>小习惯成就大事</p>
            </div>
          </div>
        </CModal>
    );
  }
}


const customContentStyle = {
  width: '90%',
  height:'90%',
  maxHeight:'none',
  maxWidth: 'none',
};

const imgStyle = {
  border:"1px solid #f2f2f2",
  borderRadius:"2px"
}