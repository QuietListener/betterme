import * as base from "../../base.js"
import React, {Component} from 'react';
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

    var Width = this.props.width || 20 * 16;
    var DayWidth = Width / 14
    var DayMargin = DayWidth / 14;

    var today = Moment(this.props.today)
    var first_day = today.date(1);
    var month = today.month();
    var datas = {}

    var events = this.props.events.map((item) => {
      return Moment(item, "YYYY-MM-DD")
    })
    //console.log(events);
    var init_days = first_day.days();
    for (var i = 0; i < init_days && i < 6; i++)
    {
      datas[i] = [null];
    }

    var i = 0;
    while (first_day.month() == month)
    {
      var days = first_day.days();
      var dates = first_day.date();

      if (datas[days] == null)
      {
        datas[days] = []
      }
      datas[days].push(Moment(first_day));
      first_day = first_day.add(1, "days");
    }


    var responsive_style = {
      width: DayWidth,
      height: DayWidth,
      borderRadius: DayWidth / 2,
      margin: DayMargin,
      marginTop: 8,
      padding: 2
    }

    var daymaps = [[0, "SUN"], [1, "MON"], [2, "TUE"], [3, "WED"], [4, "THU"], [5, "FRI"], [6, "SAT"]]
    var today = this.props.today;
    var views = daymaps.map((item, index) => {

      var column = datas[item[0]].map((i_, index_) => {

        var dayView = null;

        if (i_ == null)
        {
          dayView = <div
            key={item[1]}
            style={Object.assign({},styles.empty_day, responsive_style)}>
            <div>{null}</div>
          </div>
        }
        else
        {
          var dates = i_.date();
          var style_ =null;
          var text_styles = {color: "rgb(153, 153, 153)", fontSize: 12,margin:"auto",marginTop:"4px"};
          var isEvents = false;

          if (dates <= today.date())
          {
            style_ =  Object.assign(styles.day, responsive_style,{backgroundColor: "#f2f2f2"})

            isEvents = (events.filter((item) => {
              return i_.format("YYYYMMDD") === item.format("YYYYMMDD")
            }).length > 0);
            //console.log(i_,item)
            if (isEvents == true)
            {
              style_ = Object.assign(style_,styles.hilight_day);
              text_styles["color"] = "white"
            }
          }
          else
          {
            style_ = Object.assign(styles.day, {backgroundColor: ""}, responsive_style);
          }

          dayView = <div
            onPress={() => {
              if (this.props.dayPress)
                this.props.dayPress(i_, isEvents)
            }
            }

            key={index_ * 11112} style={Object.assign({},style_, responsive_style, {textAlign:"center"})}>
            <div key={index_ * 111121} style={text_styles}>{dates}</div>
          </div>
        }

        return dayView;
      })

      //添加标题
      var head = <span style={responsive_style}><span key={index * 111129} style={{color: "#999"}}>{item[1]}</span></span>
      column.splice(0, 0, head);

      return <div key={index * 11111} style={Object.assign({display:"inline-block",verticalAlign:"top"},{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",

      })}>{column}</div>;
    })


    //console.log("views",views);

    return (
      <div style={Object.assign({},{flexDirection: "row", justifyContent: "flex-start", paddingBottom: 6}, this.props.style)}>
        {views}
      </div>
    );
  }
}


const styles ={
  day: {
    padding: 2,
    margin: "auto",
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgb(71, 175, 255)"
  },
  hilight_day: {
    backgroundColor: "gray",
  },

  empty_day: {
    padding: 2,
    margin: 2,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  }

};