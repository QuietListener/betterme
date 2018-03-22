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
  }


  render()
  {

    return(
        <CModal >
          <div style={{textAlign:"center",marginTop:"40%"}}>
            <div style={{margin:"auto",width:"200px",height:"250px",backgroundColor:"white",borderRadius:"4px",textAlign:"center",verticalAlign:"middle",backgroundColor:base.COLOR.gray}}>
              <p style={{color:base.COLOR.red,paddingTop:"10px"}}>您获得一次抽奖机会</p>

              <div style={{margin:"auto",backgroundColor:base.COLOR.red,width:120,height:120,borderRadius:60,verticalAlign:"middle",fontSize:30,marginTop:25,paddingTop:35}}>开</div>

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