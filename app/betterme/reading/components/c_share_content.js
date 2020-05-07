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


        var tips = base.getTipByLan();
        return (
            <div style={this.props.style || {}}>
                <div style={{height: "60px", textAlign: "center", marginTop: "30px"}}>
                    <img style={{borderRadius: "25"}} width={50} height={50} src={user.img}/>
                    <div>{user.name}</div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <div style={{marginTop: "20px", textAlign: "center"}}>
                        {tips.share_1} <a>BeeReading</a> {tips.share_2} <span style={Styles.count}>{state.read_days || 0} </span> {tips.share_3}
                    </div>
                    <div style={{marginTop: "20px", textAlign: "center"}}>
                        {tips.share_4} <span style={Styles.count}>{ this.props.data.readed_count || 0} </span> {tips.share_5}
                    </div>


                </div>
                <div>

                </div>
            </div>
        );
    }

}

const Styles = {
    count: {fontSize: "16px", color: "Red",fontWeight:"bold",padding:"4px"},
    part: {marginTop: "20px", textAlign: "center"}
}
