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
export default class CPicker extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {startPoint:0,default_value_indexes:_.clone(this.props.default_value_indexes)}
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
          adder = 2;
        else if(abs_span >= ThreshHold3)
          adder = 4;

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

    //[
    // [["01时",value:1],["02时",value:2]],
    // [["1分",value:1],["2分",value:2]]
    // ]



    var option_group = this.props.option_groups


    //[0,1]  index
    var default_value_indexes = this.state.default_value_indexes

    var show_rows_count = this.props.show_rows_count || 3;

    var item_group = [];
    for(let i = 0; i < option_group.length; i++)
    {
        let options = option_group[i];

        let show_index = 0;
        if(default_value_indexes && default_value_indexes[i])
        {
          show_index = default_value_indexes[i]
        }

        let middle = Math.floor(show_rows_count/2)

        let start_index = show_index - middle;

        var column = []
        for(let j = 0, k = start_index; j < show_rows_count; j++,k++)
        {
           if(k < 0 || k >= options.length)
           {
             column.push( <div style={Object.assign(styles.item_style,this.props.item_style)}>{" "}</div> );
           }
           else
           {
             if(j == middle)
                column.push( <div value={options[k][1]} style={Object.assign(styles.show_item_style,this.props.show_item_style)}>{options[k][0]}</div> );
             else
               column.push( <div value={options[k][1]} style={Object.assign(styles.item_style,this.props.item_style)}>{options[k][0]}</div> );
           }
        }

        item_group.push(<div ref={`group_${i}`} style={Object.assign(styles.group_style,this.props.group_style)}>{column}</div>);
    }

    return (
      <div style={this.props.style}>
        {item_group}
      </div>
    );
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