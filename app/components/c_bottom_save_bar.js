import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import {axios} from "../betterme/base.js"
import * as base from "../betterme/base.js"
const AlarmAdd = require('react-icons/lib/md/alarm-add');
const AlarmOn = require('react-icons/lib/md/alarm-on');
const Heart = require('react-icons/lib/fa/heart');
const Stop = require('react-icons/lib/go/stop');

import CLoading from "../components/loadings/c_loading.js"
import Moment from "moment"


export default class CBottomSaveBar extends Component{

  constructor(props)
  {
    super(props)
  }

  componentDidMount()
  {

  }

  render()
  {

    var items = this.props.items; //[{title:title,icon:icon},{title:title,icon:icon}]
    var active_item_index =   this.props.active_item_index;
    var onItemClick = this.props.onItemClick;


    var width=`${100/items.length}%`

    var item_views = items.map((item,index)=>{
      var c_style = {width:width,borderRight:"1px solid"}
      if(index == items.length-1)
      {
        c_style = {width:width}
      }

      if(index == active_item_index)
      {
        c_style["backgroundColor"]=base.COLOR.red;
        c_style["color"]="white";
      }

      return <div style={Object.assign(c_style,styles.nav_bar_item)}
                  onClick={()=>onItemClick(index)}>
        {item.title}
      </div>
    });

    return  <div style={Object.assign(styles.nav_bar_style,this.props.style)}>
      {item_views}
    </div>
  }
}

const styles={
  nav_bar_style:{height:"50px",textAlign:"center",width:"100%",borderTop:"1px solid #f2f2",backgroundColor:"#f2f2f2"},
  nav_bar_item:{
    display:"inline-block",
    textAlign:"center",
    verticalAlign:"center",
    height:"50px",
    padding:12,
    fontSize:"20px",
    verticalAlign:"middle"
  }
}
