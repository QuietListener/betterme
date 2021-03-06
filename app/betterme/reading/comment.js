import React, {Component} from 'react';
import css from "./css/ireading.css"
import {axios} from "../base.js"
import * as base from "../base.js"
import crossPng from "../../resource/imgs/cross.png"
import CSeperator from './components/c_sperator';
import CLoading from './components/c_loading';

const BaseHost = base.BaseHostIreading();


export default class Comment extends Component
{

  constructor(props)
  {
    super(props)
    var init_plans = [];//[{id:1,plan_name:"背单词",start:"2017-12-12",end:"2017-12-22"},
    //{id:2,plan_name:"跑步",start:"2017-12-12",end:"2017-12-24"}];


    var id = null;
    if(this.props.params) {
     id =  this.props.params.id
    }

    if(this.props.id) {
      id = this.props.id;
    }


    console.log("id",id);

    this.state = {
      id: id,
      commentContent:"",
      data:{},
      userMap:{}
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.load = this.load.bind(this);
    this.commentDiv = this.commentDiv.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  componentDidMount()
  {
    this.load();
  }


  handleChange(propName, event)
  {
    let data = {}
    data[propName] = event.target.value;
    this.setState(data);
  }

  submitComment(){

    if(this.props.showLoginModal && this.props.showLoginModal() ){
      return;
    }

    var params = {
      target_id:this.state.id,
      content: this.state.commentContent
    }

    var url = `${BaseHost}/comment/addComment.json`;
    console.log(url);
    this.setState({submitting:true});
    try{
     axios.post(url, params).then((res) => {
      console.log("res", res);
      this.setState({submitting:false});
      this.load();
     }).catch(e => {
      console.log(e);
      this.setState({submitting:false});
      this.load();
     })
    }catch(e){
      this.setState({submitting:false});
    }

  }

  deleteComment(id){
    var params = {
      comment_id:id
    }

    var url = `${BaseHost}/comment/deleteComment.json`;
    console.log(url);
    axios.post(url, params).then((res) => {
      console.log("res", res);
      this.load();
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
      this.load();
    })
  }



  load()
  {
    var that = this;
    this.setState({loading: true});

    var id = this.state.id;
    axios.get(`${BaseHost}/comment/getComments.json?target_id=${this.state.id}`).then((res) => {
      console.log("res", res);
      let data = res.data.data;

      let users = data.users;
      let userMap = this.state.userMap;
      for(let i = 0;i < users.length;i++){
        let user = users[i];
        userMap[user.id] = user;
      }
      that.setState({data: data,userMap:userMap});

      console.log(that.state);
      // that.load_plans(user.id)
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
    })
  }

  commentDiv(c,isMine){
    let userMap = this.state.userMap;
    let user = userMap[c.user_id] || {}
    let deleteDiv = null;
    let like_div = null;

    if(isMine == true){
      deleteDiv =  <div  className={css.box} style={{fontSize:"12px"}} onClick={()=>this.deleteComment(c.id)}>
        <img src={crossPng} width={12} height={12}/>
      </div>;
    }

    //先不启用
    if(!isMine && false){
      like_div = <div style={{display:"inline-block",textAlign:"right",width:"36%"}}> <span>like</span></div>
    }

    let time = c.created_at.split("T")[0];
    return <div className={css.box1} style={{width:"100%",padding:"8px",margin:"4px",marginBottom:"6px",fontSize:"12px"}}>
      <div>
        <div className={css.smallText} style={{display:"inline-block",width:"60%",fontWeight:"bold"}} >{user["name"]||"user"}</div>

        {like_div}
      </div>

      <div style={{marginBottom:"8px",fontSize:"12px",marginTop:"4px"}}>
        {c.content}
      </div>

      <div >
        <div style={{display:"inline-block",textAlign:"left",verticalAlign:"top",width:"50%"}}>
          <span  className={css.smallText} style={{color:base.COLOR.gray1}}> {time}</span>
        </div>
        <div style={{display:"inline-block",textAlign:"right",verticalAlign:"top",width:"49%"}}>{deleteDiv}</div>
      </div>

      <CSeperator></CSeperator>
    </div>
  }
  render()
  {


    var my_comments = this.state.data.my_comments||[];
    var comments = this.state.data.comments||[];

    var my_comments_divs = my_comments.map(c=>{
        return this.commentDiv(c,true);
    })

    var comments_divs = comments.map(c=>{
      return this.commentDiv(c,false);
    })
    let tips = base.getTipByLan();
    return (
      <div>
        {/*评论框*/}
        <div style={{marginBottom:"40px",marginLeft:"10px",marginRight:"10px"}}>
         <div style={inner_style.textBox} onChange={event=>this.handleChange("commentContent",event)}>
           <textarea  placeholder={tips.commitTip} style={{width:"100%",height:"100px",border:"1px solid #f2f2f2",borderRadius:"4px"}} value={this.state.commentContent} ></textarea>
         </div>
         <div style={{textAlign:"right",marginRight:"2px",marginTop:"6px"}}>
              <div className={css.ibtn} style={{fontSize:"14px",margin:"4px",fontSize:"14px",padding:"4px",backgroundColor:"",color:"black"}} onClick={this.state.submitting == true? null: this.submitComment}> {this.state.submitting == true?<CLoading />:tips.commit} </div>
         </div>

        </div>

        {/*展示所有评论*/}
        <div>
          {my_comments_divs}

          {comments_divs}
        </div>

      </div>
    );
  }
}

const inner_style = {
  textBox: {display: "inline-block", verticalAlign: "top", width: "100%", fontSize: "10px"},
  input: {fontSize: "22px", minWidth: "120px", border: "0px", borderBottom: "1px solid #f2f2f2", marginTop: "10px"}
}