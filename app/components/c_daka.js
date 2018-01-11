import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import axios from "axios"
import * as base from "../betterme/base.js"

export default class CDaka extends Component{

  constructor(props)
  {
    super(props)

    this.state={
      show_daka:false,
      thought:null,
      images:[]
    };

    this.valueChange = this.valueChange.bind(this);
    this.show_daka = this.show_daka.bind(this);
    this.create_record = this.create_record.bind(this);
    this.readFile = this.readFile.bind(this);
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

      axios.post(`${base.BaseHost}/index/create_plan_record.json`,
        formData).then((res)=>{
        if(that.props.daka_success)
            that.props.daka_success();
      })

  }

  show_daka()
  {
    this.setState({show_daka:true});
  }

  render(){
    var show_view = null;

    var plan = this.props.plan;
    var finished_days = plan.finished_days_count
    var total_days = plan.total_days_count

    if(total_days == finished_days)
    {
      show_view = <div
        style={{padding:"8px",width:"100%",height:"40px",backgroundColor:"red",color:"white",borderRadius:4,marginTop:10}}
      >
        完成了整个计划~
      </div>
    }
    else if(plan.finished_daka_today == true)
    {
      show_view = <div
        style={{padding:"8px",width:"100%",height:"40px",backgroundColor:"red",color:"white",borderRadius:4,marginTop:10}}
      >
          完成今天的打卡
      </div>
    }
    else if(this.state.show_daka == false)
    {
      show_view = <div
        style={{padding:"8px",width:"100%",height:"40px",backgroundColor:"green",color:"white",borderRadius:4,marginTop:10}}
        onClick={()=>this.show_daka()}
      >
        打卡
      </div>
    }
    else
    {

      var imgs_view = this.state.images.map((img)=>{
        return <img style={{border:"1px solid #f2f2f2",height:"80px",display:"inline-block",verticalAlign:"top",marginLeft:"4px"}} src={img[1]} />
      });

      show_view = <div style={{padding:"8px",width:"100%",marginTop:10,textAlign:"left"}}>
        <textarea
          style={{width:"100%",border:"1px solid #f2f2f2",fontSize:"16px"}}
          placeholder={"我今天完成了...."}
          value={this.state["desc"]}
          onChange={(event)=>this.valueChange(event,"desc")} />

        <div style={{marginTop:"4px"}}>
          <input ref={(ref) => this.upload = ref}
                 style={{display:"none"}}
                 onChange={(event)=> {
                   this.readFile(event)
                 }}
                 type='file' multiple accept='image/*' />

          <div style={{textAlign:"center",border:"1px solid #f2f2f2",height:"80px",width:"80px",display:"inline-block",verticalAlign:"top"}}
               onClick={()=>{this.upload.click()}}>
               <span style={{fontSize:"24px",marginTop:"30px"}}> + </span>
          </div>

          {imgs_view}
        </div>


        <div style={{width:"100%",textAlign:"right"}}>
          <button style={{marginTop:"10px",backgroundColor:"red",color:"white",fontSize:"16px",}} onClick={this.create_record}>确定</button>
        </div>

      </div>
    }

    return show_view;
  }
}
