import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import axios from "axios"
import * as base from "../betterme/base.js"
import Picker from 'react-mobile-picker';
import Moment from "moment"

export default class CTimepicker extends Component
{
  constructor(props)
  {
    super(props);

    var m = Moment();

    var hoursOptions = [];
    var minutesOptions = [];
    for(var i = 0; i< 24; i++)
    {
      hoursOptions.push(i);
    }

    for(var j = 0; j< 60; j++)
    {
      minutesOptions.push(j);
    }

    this.state = {
      valueGroups: {
        hours: this.props.hours,
        minutes: this.props.minutes ,
      },

      optionGroups: {
        hours: hoursOptions,
        minutes: minutesOptions
      }
    };

    this.handleChange = this.handleChange.bind(this);

   // alert(`${this.props.hours} - ${this.props.minutes}`)

  }


  // Update the value in response to user picking event
  handleChange(name, value)
  {
    console.log(`picker change: ${name} - ${value}`);
    var valueGroups = this.state.valueGroups;
    valueGroups[name] = value;

    this.setState({valueGroups:_.clone(valueGroups)});

    if(this.props.onTimeChange)
    {
      this.props.onTimeChange(this.state.valueGroups.hour,this.state.valueGroups.minute);
    }
  }


  render()
  {
    const {optionGroups, valueGroups} = this.state;

    return (

      <div style={Object.assign({textAlign:"center"},this.props.style)}>

        <div style={{border:`1px solid ${base.COLOR.blue}`}}>
          <div style={{padding:"0 20px 0 20px",borderBottom:`1px solid ${base.COLOR.blue}`,verticalAlign:"middle"}}>
            <div style={styles.header_item}>时</div>
            <div style={styles.header_item}>分</div>
          </div>

          <Picker style={{border:`1px solid ${base.COLOR.blue}`}}
                  height={160}
                  itemHeight={40}
                  optionGroups={optionGroups}
                  valueGroups={valueGroups}
                  onChange={this.handleChange} />
        </div>

        <div style={{fontSize:"16px"}}>
          我们将在
          <span style={styles.hilight_time}> {this.state.valueGroups.hours} </span>:
          <span style={styles.hilight_time}> {this.state.valueGroups.minutes}</span>
            发送提醒通知
        </div>
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
  hilight_time:{
    fontSize:"20px",
    color:base.COLOR.red
  }
};