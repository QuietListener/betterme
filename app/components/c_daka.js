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
import CToast from "./c_toast"

export default class CDaka extends Component{

  constructor(props)
  {
    super(props)

    this.state={
      show_daka:false,
      thought:null,
      images:[],
      loading:false
    };

    this.valueChange = this.valueChange.bind(this);
    this.show_daka = this.show_daka.bind(this);
    this.create_record = this.create_record.bind(this);
    this.readFile = this.readFile.bind(this);
    this.reset_reward = this.reset_reward.bind(this);
  }

  componentDidMount()
  {
    console.log("componentDidMount",this.state);
  }

  valueChange(e,name)
  {
    var new_value = {}
    new_value[name] = e.target.value,
      this.setState(new_value);
  }


  readFile(e)
  {
    if(!this.upload.files[0])
      return;

    this.setState({
      images:[]
    });

    let files = e.target.files;
    for(let i = 0; i < files.length; i++)
    {
      let reader = new FileReader();
      let file = e.target.files[i];
      reader.onloadend = () => {
        let j = i;
        let images = this.state.images;
        images.push([j,reader.result])
        this.setState({
          images:images
        });
      }
      reader.readAsDataURL(file)
    }

  }

  create_record()
  {
      var desc = this.state.desc;
      var plan_id = this.props.plan.id;
      var that = this;

      var formData = new FormData();
      formData.append("plan_id",plan_id);
      formData.append("desc",desc);

      for(let i = 0; i < this.state.images.length; i++ )
      {
        let item =  this.state.images[i];
        let index=item[0];
        console.log(item);
        console.log(index);

        formData.append(`images[]`,this.upload.files[index]);
      }


      if(this.props.daka_start)
      {
        this.props.daka_start();
      }

      axios.post(`${base.BaseHost}/index/create_plan_record.json`,
        formData).then((res)=>{

        console.log("daka res",res);

        if(res.data && res.data.data && res.data.data.reward)
        {
          this.setState({reward:res.data.data.reward.content})
        }

        if(that.props.daka_success)
            that.props.daka_success();
      }).catch((e)=>{

          if(this.props.daka_error)
          {
            this.props.daka_error(e);
          }

      })

  }

  reset_reward()
  {
    this.setState({reward:null})
  }

  show_daka()
  {
    this.setState({show_daka:true});
  }

  render(){

    var today = base.today();
    var show_view = null;

    var plan = this.props.plan;
    var finished_days = plan.finished_days_count
    var total_days = plan.total_days_count

    var today_ = Moment();
    var end  = Moment(plan.end);

    console.log("end",end);
    if(total_days <= finished_days)
    {
      show_view = <div
        style={Object.assign({},styles.daka_box,{backgroundColor:base.COLOR.red})}
      >
        <Heart style={styles.icon}/>计划完成
      </div>
    }
    else if(today_ - end > 0)
    {
      show_view = <div style={Object.assign({},styles.daka_box,{backgroundColor:base.COLOR.yellow})}>
        <Stop  style={styles.icon}/>计划过期
      </div>
    }
    else if(plan.finished_daka_today == true)
    {
      show_view = <div style={Object.assign({},styles.daka_box,{backgroundColor:base.COLOR.blue})} >
        <AlarmOn  style={styles.icon}/>打卡完成
      </div>
    }
    else if(this.state.show_daka == false)
    {
      show_view = <div  style={Object.assign(styles.daka_box,{color:"black"})}
        onClick={()=>this.show_daka()} >
        <AlarmAdd style={styles.icon}/>打卡
      </div>
    }
    else
    {
      var imgs_view = this.state.images.map((img)=>{
        return <img style={{border:"1px solid #f2f2f2",height:"80px",display:"inline-block",verticalAlign:"top",marginLeft:"4px"}} src={img[1]} />
      });

      show_view = <div style={{padding:"8px",width:"100%",marginTop:10,textAlign:"left",borderTop:"1px solid #f2f2f2"}}>
        <textarea
          style={{width:"100%",border:"1px solid #f2f2f2",fontSize:"16px"}}
          placeholder={"说点什么吧...."}
          value={this.state["desc"]}
          onChange={(event)=>this.valueChange(event,"desc")} />

        <div style={{marginTop:"4px",paddingBottom:"8px",borderBottom:"1px solid #f2f2f2"}}>
          <input ref={(ref) => this.upload = ref}
                 style={{display:"none"}}
                 onChange={(event)=> {
                   this.readFile(event)
                 }}
                 type='file' multiple accept='image/*' capture='camera'/>

          <div style={{textAlign:"center",border:"1px solid #f2f2f2",height:"80px",width:"80px",display:"inline-block",verticalAlign:"top"}}
               onClick={()=>{this.upload.click()}}>
            <p style={{fontSize:"24px",marginTop:"10px",color:base.COLOR.blue}}> <span style={{fontSize:"12px"}}>添加图片</span><br/> + </p>
          </div>

          {imgs_view}
        </div>


        <div style={{width:"100%",textAlign:"right"}}>
          <button style={{margin:"10px",padding:"4px",borderRadius:"4px",backgroundColor:base.COLOR.blue,color:"white",fontSize:"16px",}} onClick={()=>this.setState({show_daka:false})}>取消</button>

          <button style={{margin:"10px",padding:"4px",borderRadius:"4px",backgroundColor:base.COLOR.red,color:"white",fontSize:"16px",}} onClick={this.create_record}>确定</button>
        </div>

      </div>
    }

    return <div>

      {/*打卡领积分*/}
      {this.state.reward ?<CToast timeout={1500} hide={this.reset_reward} >
        <p style={{color:"white",fontSize:"20px"}}>恭喜获得<span style={{margin:6,fontSize:30,color:"white",color:base.COLOR.red}}>{this.state.reward}</span>积分</p>
      </CToast> : null}

      {show_view}
      </div>
  }
}

const styles={

  daka_box:{padding:"8px",
    width:"100%",height:"40px",
    borderWidth:1,
    borderColor:base.COLOR.gray,
    fontWeight:"bold",
    padding:"10px",
    color:"white",
    textAlign:"center",
    borderRadius:4,marginTop:10}
   ,
  icon:{
    fontSize:"18px",
    color:"white",
    marginRight:"4px",
    verticalAlign:"bottom"
  }
}
