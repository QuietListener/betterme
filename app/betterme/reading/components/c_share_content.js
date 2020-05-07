import React, {Component} from 'react';
import crossPng from "../../../resource/imgs/cross.png"
import {axios} from "../../base.js"
import * as base from "../../base.js"
import CLoading from "./c_loading";

const BaseHost = base.BaseHostIreading();
export default class CShareContent extends Component {

    constructor(props) {
        super(props)
        let user_id = this.props.user_id || null;
        this.state = {user_id: user_id}
    }

    render() {

        if (this.props.data == null || this.props.data == {}) {
            return null;
        }

        var user = this.props.data.user || {};
        var state = this.props.data.state || {};
        var date = this.props.date;
        var finish_dates_ = this.props.data.finish_dates || [];


        return (
            <div style={this.props.style || {}}>
                <div style={{height: "60px", textAlign: "center", marginTop: "30px"}}>
                    <img style={{borderRadius: "25"}} width={50} height={50} src={user.img}/>
                    <div>{user.name}</div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <div style={{marginTop: "20px", textAlign: "center"}}>
                        我在 <a>BeeReading</a> 上，坚持阅读了 <span style={Styles.count}>{state.read_days || 0} </span> 天
                    </div>
                    <div style={{marginTop: "20px", textAlign: "center"}}>
                        学完了 <span style={Styles.count}>{state.readed_count || 0} 篇</span> 英文文章
                    </div>


                </div>
                <div>

                </div>
            </div>
        );
    }

}

const Styles = {
    count: {fontSize: "12px", fontColor: "Red"},
    part: {marginTop: "20px", textAlign: "center"}
}
