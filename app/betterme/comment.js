import React, {Component} from 'react';
import config from '../conf/config.json';
import * as base from "./base.js"
import _ from "lodash"
import '../css/app.css';
import {axios} from "./base.js"


const BaseHost = "http://localhost:3100"


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
    var params = {
      target_id:this.state.id,
      content: this.state.commentContent
    }

    var url = `${BaseHost}/comment/addComment.json`;
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

  commentDiv(c){
    let userMap = this.state.userMap;
    let user = userMap[c.user_id] || {}
    let deleteDiv = null;

    if(this.props.user_id == user.id){
      deleteDiv =  <div onClick={()=>this.deleteComment(c.id)}>delete</div>;
    }

    let time = c.created_at.split("T")[0];
    return <div style={{width:"100%",marginLeft:"8px",margin:"4px",marginBottom:"20px",fontSize:"14px",borderBottom:"1px solid green"}}>
      <div>
      {user["name"]||"user"} {time}
      </div>

      <div style={{marginBottom:"8px",fontSize:"14px"}}>
        {c.content}
      </div>

      <div>
        {deleteDiv}
      </div>

    </div>
  }
  render()
  {


    var my_comments = this.state.data.my_comments||[];
    var comments = this.state.data.comments||[];

    var my_comments_divs = my_comments.map(c=>{
        return this.commentDiv(c);
    })

    var comments_divs = comments.map(c=>{
      return this.commentDiv(c);
    })

    return (

      <div>
        {/*评论框*/}
        <div>
         <div style={inner_style.textBox} onChange={event=>this.handleChange("commentContent",event)}>
           <textarea  style={{width:"100%",height:"100px"}} value={this.state.commentContent} ></textarea>
         </div>
         <div style={{textAlign:"right"}}>
              <div style={{margin:"4px"}} onClick={this.submitComment}> submit</div>
         </div>

        </div>

        {/*展示所有评论*/}
        <div>
          {my_comments_divs}
          <hr/>
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