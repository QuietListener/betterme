import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import axios from "axios"
import * as base from "../betterme/base.js"
import Picker from 'react-mobile-picker';
import Moment from "moment"

const ThreshHold1 = 20;
const ThreshHold2 = 4*ThreshHold1;
const ThreshHold3 = 7*ThreshHold1;

export default class CPicker1 extends Component
{
  constructor(props)
  {
    super(props);
    var marginTop = {};
    for(let i = 0; i < this.props.option_groups.length; i++)
    {
      marginTop[`margin${i}`] = 0;
    }

    this.state = Object.assign({startPoint:0,default_value_indexes:_.clone(this.props.default_value_indexes)},marginTop);
  }

  componentDidMount()
  {

  }

  componentDidMount()
  {
    var that = this;

    var option_groups = this.props.option_groups
    for(let i = 0; i < option_groups.length; i++)
    {
      let ref = this.refs[`group_${i}`];
      ref.addEventListener("touchstart", function (e) {
        var startPoint = e.changedTouches[0].pageY;
        that.setState({startPoint})
        console.log("touchstart", startPoint);
      });

      //手指滑动
      ref.addEventListener("touchmove",function(e){
        var endPointY = e.changedTouches[0].pageY;
        console.log("touchmove", endPointY);
        var span = endPointY - that.state.startPoint;
        var abs_span = Math.abs(span);
        var marginVar = {};
        marginVar[`margin${i}`] = span;
        that.setState(marginVar);
      });

      //当手指抬起的时候，判断图片滚动离左右的距离，当
      ref.addEventListener("touchend", function (e) {
        var endPoint = e.changedTouches[0].pageY;
        console.log("touchend", endPoint);
        var span = endPoint - that.state.startPoint;
        var abs_span = Math.abs(span);

        var default_value_indexes = that.state.default_value_indexes
        var index = default_value_indexes[i];
        var option_group = option_groups[i];

        var adder = 1;
        if(abs_span >= ThreshHold2 && abs_span < ThreshHold3)
          adder = 3;
        else if(abs_span >= ThreshHold3)
          adder = 8;

        if (abs_span > ThreshHold1)
        {
          if (span > 0)
          {
            console.log("down");
            index = index - adder;
            if(index < 0)
              index = 0;
          }
          else
          {
            console.log("up")
            index = index + adder;
            if(index > option_group.length-1)
              index = option_group.length-1;
          }
        }

        var new_value_indexes = _.clone(that.state.default_value_indexes);
        new_value_indexes[i] = index;

        that.setState({default_value_indexes:new_value_indexes});

        if(default_value_indexes.join(",") != new_value_indexes.join(","))
        {
          if(that.props.value_changed)
            that.props.value_changed(new_value_indexes);
        }
        //console.log("default_value_indexes",new_value_indexes);
      })
    }
  }


  render()
  {

    var default_value_tip = this.props.default_value_tip||null;
    var option_group = this.props.option_groups


    //[0,1]  index
    var default_value_indexes = this.state.default_value_indexes

    var show_rows_count = this.props.show_rows_count || 3;

    var item_group = [];
    for(let i = 0; i < option_group.length; i++)
    {
      let options = option_group[i];

      var column = options.map((item)=>{
       return  <div style={{border:"1px solid black",width:100}}>
                {item[1]}
      </div> })

      item_group.push(<div ref={`group_${i}`}
                           style={Object.assign({marginTop:this.state[`margin${i}`]},styles.group_style,this.props.group_style)}>{column}</div>);

    }
      return ( <div>
        {"sss"}
            {item_group}
          </div> );
  }
}


const styles ={
  header_item:{
    width:"50%",
    display:"inline-block",
    verticalAlign:"middle",
    textAlign:"center",
    fontSize:"20px"
  },
  item_style:{
    display:"flex",/*Flex布局*/
    display: "-webkit-flex", /* Safari */
    alignItems:"center",/*指定垂直居中*/
    minWidth:"80px",
    minHeight:"40px",
    textAlign:"center",
    justifyContent:"center",
    verticalAlign:"middle"
  },

  show_item_style:{
    display:"flex",/*Flex布局*/
    display: "-webkit-flex", /* Safari */
    alignItems:"center",/*指定垂直居中*/
    minWidth:"80px",
    minHeight:"40px",
    textAlign:"center",
    justifyContent:"center",
    verticalAlign:"middle",
    borderTop:"1px solid",
    borderBottom:"1px solid"
  },
  group_style:{
    display:"inline-block",
    verticalAlign:"top"
  }
};