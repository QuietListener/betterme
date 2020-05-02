import React, {Component} from 'react';
import crossPng from "../../../resource/imgs/cross.png"
import {axios} from "../../base.js"
import * as base from "../../base.js"
const BaseHost = base.BaseHostIreading();
export default class CShareContent extends Component {

  constructor(props) {
    super(props)
    this.state={}
    this.load_user_state = this.load_user_state.bind(this);
  }


  load_user_state() {
    var that = this;
    this.setState({loading: true});
    var id = this.state.id;
    axios.get(`${BaseHost}/reading/get_user_state.json`).then((res) => {
      console.log("res", res);
      that.setState({data: res.data.data});
      console.log(that.state);
      // that.load_plans(user.id)
    }).catch(e => {
      console.log(e);
      this.setState({loading: false});
    })
  }


  componentDidMount() {
    this.load_user_state();
  }

  render() {

    if (this.state.data == null || this.state.data == {}) {
      return null;
    }

      var user = this.state.data.user || {};
      var state = this.state.data.state || {};
      var date = this.state.date;
      var finish_dates_ = this.state.data.finish_dates || [];


      return (
          <div style={this.props.style||{}}>
            <div style={{height: "60px", textAlign: "center",marginTop:"30px"}}>
              <img style={{borderRadius: "25"}} width={50} height={50} src={user.img}/>
              <div>{user.name}</div>
            </div>

            <div style={{marginTop:"30px"}}>
              <div style={{}}>
                <span style={Styles.count}>{state.read_days || 0} </span> days
              </div>

              <div style={{marginTop:"20px",textAlign:"center"}}>
                <div style={Styles.count}>{state.readed_count || 0} </div>
                articles
              </div>

            </div>
            <div>

            </div>
          </div>
      );
    }

}

const Styles={
  count:{fontSize:"12px",fontColor:"Red"},
  part:{marginTop:"20px",textAlign:"center"}
}
