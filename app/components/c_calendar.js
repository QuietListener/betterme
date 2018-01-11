import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import axios from "axios"
import * as base from "../betterme/base.js"

import Moment from "moment"

export default class CCalendar extends Component
{
  constructor(props)
  {
    super(props);

    //console.log(props);

  }

  render()
  {

    var start = Moment(this.props.start);
    var end = Moment(this.props.end);

    console.log(start,end)

    var Width = this.props.width||20*16;
    var DayWidth = Width/16;
    var DayMargin = DayWidth/8;

    var today = Moment(this.props.today)
    var first_day = today.date(1);
    var month = today.month();
    var datas = {}

    var events = this.props.events.map((item)=>{return  Moment(item,"YYYY-MM-DD")})
    //console.log(events);
    var init_days = first_day.days();
    for(var i = 0;i < init_days && i < 6; i++)
    {
      datas[i] = [null];
    }

    var i = 0;
    while(first_day.month() == month)
    {
      var days = first_day.days();
      var  dates = first_day.date();

      if(datas[days] == null)
      {
        datas[days] = []
      }
      datas[days].push(Moment(first_day));
      first_day = first_day.add(1,"days");
    }


    var responsive_style = {width:DayWidth,height:DayWidth, borderRadius:DayWidth/2,margin:DayMargin}

    var daymaps = [[0,"SUN"], [1,"MON"] ,[2,"TUE"] ,[3,"WED"] ,[4,"THU"] ,[5,"FRI"] ,[6,"SAT"]]
    var today = Moment();
    var views = daymaps.map((item,index)=>{

      var column = datas[item[0]].map((i_,index_)=>{

        let dayView =  null;

        if(i_ == null)
        {
          var empty_style = Object.assign(styles.empty_day,responsive_style);
          dayView = <div style={empty_style}><span>{null}</span></div>
        }
        else
        {
          let dates = i_.date();
          console.log("---",i_.format("YYYYMMDD"),start.format("YYYYMMDD"),end.format("YYYYMMDD"));
          let  style_ = {};
          let   text_styles = {color:"rgb(153, 153, 153)",fontSize:12};

          if(i_ >= start && i_ <= end)
          {
            style_ = Object.assign({},styles.day,responsive_style,{border:"1px solid rgb(71, 175, 255)"});

            var isEvents = (events.filter((item)=>{return i_.format("YYYYMMDD") === item.format("YYYYMMDD")}).length > 0);
            //console.log(i_,item)
            if(isEvents == true)
            {
              style_ = Object.assign({},style_, styles.hilight_day);
              text_styles["color"]="white"
            }
          }
          else
          {
            style_ = Object.assign(styles.day,{borderWidth:0},responsive_style);
          }


          dayView = <div style={style_}>
            <div style={text_styles}>{dates}</div>
          </div>
          style_ = {};
        }

        return dayView;
      })

      //添加标题
      var head = <span  style={{color:"#999"}}>{item[1]}</span>
      column.splice(0,0,head);

      return <div style={{display:"inline-block",width:"14%",verticalAlign:"top"}}>{column}</div>;
    })


    //console.log("views",views);

    return (
      <div style={{width:"100%",marginTop:"0px"}}>
        {views}
      </div>
    );
  }
}


const styles ={
  day:{
    textAlign:"center",
    padding:2,
    margin:2,
    width:20,
    height:20,
    borderRadius:10,
    borderWidth:1,
    borderColor:"rgb(71, 175, 255)"
  },
  hilight_day:{
    backgroundColor:"rgb(71, 175, 255)",
  },

  empty_day:{
    padding:2,
    margin:2,
    width:20,
    height:20
  }

};