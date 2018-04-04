import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import {axios} from "./base.js"
import * as base from "./base.js"
import CCalendar from "../components/c_calendar.js"
import moment from "moment"
import CLoading from "../components/loadings/c_loading.js"
import DatePicker  from 'material-ui/DatePicker';
import TextField   from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Picker from 'react-mobile-picker';
import "../css/app.css"

class NewPlan extends Component{

  constructor(props)
  {
    super(props)
    var id = (this.props.params != null && this.props.params.id != null) ?this.props.params.id: null;

    var m = moment();

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

    this.state={
      id:id,
      open:false,
      MAX_DAYS:21,
      score_per_day:50,
      need_score:0,
      init_hours: m.hours(),
      init_minutes: m.minutes(),
      valueGroups: {
        hours: m.hours(),
        minutes: m.hours(),
      },

      optionGroups: {
        hours: hoursOptions,
        minutes: minutesOptions
      }
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.load = this.load.bind(this);
    this.create_new_plan = this.create_new_plan.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.load_data = this.load_data.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }


  load()
  {
      var that = this;
      that.setState({loading: true});
      axios.get(`${base.BaseHost}/index/plan.json?id=${this.state.id}`).then((res) => {
        console.log("res plan.json", res);
        var plan = res.data.data;

        var start = moment(plan.start,"YYYY-MM-DD").toDate();
        var end  =  moment(plan.end,"YYYY-MM-DD").toDate();

        var valueGroups={
          hours:plan.alert?plan.alert.hours : moment().hours(),
          minutes:plan.alert?plan.alert.minutes : moment().minutes()
        }

        //alert(plan.alert.hours);
        that.setState({plan_name: plan.name,
          start:start,
          end:end,
          loading: false,
          valueGroups:valueGroups
        });

        this.caculate_need_score(start,end);
        console.log("state",that.state);

      }).catch(e => {
        console.error(e);
        that.setState({loading: false});
      })

  }



  handleClose()
  {
    this.setState({open: false});
  };


  create_new_plan()
  {

    var plan_name = this.state.plan_name;
    var start = base.formatDate1(this.state.start);
    var end  =  base.formatDate1(this.state.end);
    var new_plan = {plan_name,start,end};

    var that = this;
    this.setState({loading:true});
    console.log("create_new_plan.json",this.state);
    axios.post(`${base.BaseHost}/index/create_plan.json`,
      {
        id:this.state.id,
        name:plan_name,
        start_time:start,
        end_time:end,
        hours:this.state.valueGroups.hours,
        minutes:this.state.valueGroups.minutes

      }).then((res)=>{

      var data = res.data;
      if(data && data.status == 1)
      {
        base.goto("/")
      }
      else
      {
          alert(data.smsg||data.msg)
      }


    }).catch((e)=>{
      console.log(e);
      this.setState({loading:false,new_plan_msg:"网络错误",open:true});

    })
  }


  create_or_update_alert()
  {

    var plan_id = this.state.id;
    var hours = this.state.hours;
    var minutes  = this.state.minutes;

    var data = {plan_id,hours,minutes}
    var that = this;
    this.setState({loading:true});
    axios.post(`${base.BaseHost}/index/create_or_update_alert.json`,data).then((res)=>{
      alert("保存成功");
      this.setState({loading:false});
    }).catch((e)=>{
      console.log(e);
      this.setState({loading:false,new_plan_msg:"网络错误",open:true});
    })
  }


  check_date(from,to,span)
  {
    console.log("check_date from",from)
    console.log("check_date to",to)

    // if(from != null)
    // {
    //   var today =moment().startOf("day")
    //
    //   if(from - today < 0 )
    //   {
    //     this.setState({new_plan_msg:`开始时间要在${today.format(base.DateFormat)}之后喔~`})
    //     return false;
    //   }
    // }

    if(from != null && to != null)
    {
      let min_seconds = to - from;
      if(min_seconds <=0 )
      {
        this.setState({new_plan_msg: `结束日期太早了吧~`})
        return false;
      }

      var days = min_seconds * 1.0 / base.DayMinSeconds;
      if (days > span)
      {
        this.setState({new_plan_msg: `这个目标太大了，最好不要超过${span}天`})
        return false;
      }
    }

    if(from == null || to == null)
      return true;

    return true;
  }


  caculate_need_score(from,to)
  {
    if(from != null && to != null)
    {
      let min_seconds = to - from;
      if (min_seconds <= 0)
      {
        return false;
      }

      var days = Math.ceil(min_seconds * 1.0 / base.DayMinSeconds)+1;
      var need_scores = days*this.state.score_per_day;
      this.setState({need_score:need_scores});
    }
  }

  onTimeChange(hours,minutes)
  {
    this.setState({hours:hours,minutes:minutes})

    console.log(`onTimeChange ${JSON.stringify(this.state)}`)
  }

componentDidMount()
  {
    this.load_data();
    if(this.state.id != null && parseInt(this.state.id) > 0)
    {
      this.load();
    }
    console.log("componentDidMount",this.state);
  }

  // Update the value in response to user picking event
  handleChange(name, value)
  {
    console.log(`picker change: ${name} - ${value}`);
    var valueGroups = this.state.valueGroups;
    valueGroups[name] = value;
    this.setState({valueGroups:valueGroups});
  }


  async load_data()
  {
    try
    {
      this.setState({loading:true})
      var res = await axios.get(`${base.BaseHost}/index/user.json`);
      console.log("res",res);
      var user = res.data.data;
      this.setState({user:user,loading:false});

    }
    catch(e)
    {
      this.setState({loading:false});
    }
  }

  render(){

    console.log("state",this.state);
    var user = this.state.user;
    var loading_view = <CLoading/>

    if(this.state.loading == true)
      return loading_view;

    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onClick={this.handleClose}
      />,
    ];


    return(
      <div>
        <div style={{margin:"auto",backgroundColor:"white",margin:"8px",borderRadius:"4px"}}>

          <div style={{textAlign:"center",marginBottom:"1px",marginTop:"20px",marginTop:"20px"}}>
            <p style={{padding:"9px",fontSize:"25px",color:base.COLOR.red}}>{base.slogon1}</p>
          </div>

          <div style={{textAlign:"center",marginBottom:"1px"}}>
            {/*<input style={inner_style.input}*/}
            {/*value={this.state.plan_name}*/}
            {/*placeholder={"输入我要制定的目标"}*/}
            {/*onChange={(event)=>this.valueChange(event,PlanName)} />*/}

            <TextField
              hintText={"我的目标名字"}
              value={this.state.plan_name}
              onChange={(event,new_value)=>this.setState({plan_name:new_value})}
            />
          </div>



          <div style={{textAlign:"center"}}>

            { !this.state.id || this.state.id < 0  ?
              <div>
                <DatePicker value={this.state.start} hintText="开始日期" autoOk={false}
                            formatDate={(date)=>{return base.formatDate1(date)}}
                            onChange={(event,newValue)=>{

                              console.log("start123",base.formatDate1(this.state.start));

                              console.log(`start:end=${this.state.start} newValue`,newValue);
                              let ret = this.check_date(newValue,this.state.end,this.state.MAX_DAYS);
                              this.caculate_need_score(newValue,this.state.end);
                              if(ret == false)
                              {
                                this.setState({open:true})
                                return;
                              }
                              this.setState({start:newValue})

                            }}/>
                <DatePicker value={this.state.end} hintText="结束日期" autoOk={false}
                            formatDate={(date)=>{return base.formatDate1(date)}}
                            onChange={(event,newValue)=>{
                              console.log(`end:start=${this.state.start} newValue`,newValue);
                              let ret = this.check_date(this.state.start,newValue,this.state.MAX_DAYS);
                              this.caculate_need_score(this.state.start,newValue);
                              if(ret == false)
                              {
                                this.setState({open:true})
                                return;
                              }

                              var m = moment(newValue)
                              var date_ = m.format("YYYY-MM-DD");
                              var value = moment(date_,date_).toDate()
                              this.setState({end:newValue})
                            }}/>
              </div>:

              <div>
                <div style={inner_styles.time_row}>{this.state.start? base.formatDate1(this.state.start):null}  ---  {this.state.end? base.formatDate1(this.state.end):null}</div>
              </div>

            }


            {this.state.user ?<div style={inner_styles.time_row}>
              <span>总积分:</span><span>{ this.state.user.statistics.total_score }</span>   <span>消耗:</span><span>{this.state.need_score}分</span>
            </div>:null}

          </div>

          <Dialog
            title=""
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            {this.state.new_plan_msg}
          </Dialog>

        </div>
        <div style={Object.assign({textAlign:"center"},this.props.style)}>

          <div style={{border:`1px solid ${base.COLOR.blue}`}}>
            <div style={{padding:"0 20px 20px 20px",verticalAlign:"middle"}}>
              <div style={inner_styles.header_item}>时</div>
              <div style={inner_styles.header_item}>分</div>
            </div>

            <Picker style={{border:`1px solid ${base.COLOR.blue}`,backgroundColor:"white"}}
                    height={160}
                    itemHeight={40}
                    optionGroups={this.state.optionGroups}
                    valueGroups={this.state.valueGroups}
                    onChange={this.handleChange} />
          </div>

          <div style={{fontSize:"16px"}}>
            我们将在
            <span style={inner_styles.hilight_time}> {this.state.valueGroups.hours} </span>:
            <span style={inner_styles.hilight_time}> {this.state.valueGroups.minutes}</span>
            发送提醒通知
          </div>
        </div>
        <div style={{textAlign:"center",borderTop:"1px solid "}}>
          <RaisedButton label={"取消"} primary={true}
                        style={{margin:"10px"}} onClick={()=>base.goto("/")}  ></RaisedButton>

          <RaisedButton label={"制定  小目标"} secondary={true}
                        style={{margin:"10px"}} onClick={()=>this.create_new_plan()} ></RaisedButton>
        </div>

      </div>
    )

  }
}

const inner_styles={
  time_row:{
    padding:"4px",
    margin:"4px",
    fontSize:"20px",
    textAlign:"center",
    marginLeft:"14px"
  },
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
}

import { connect } from "react-redux";
import {TEST,test} from "./redux/actions/actions"


const mapStateToProps = state => {
  return {
    test: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    test: txt => {
      dispatch(test(txt))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NewPlan);