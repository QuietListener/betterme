import React, {Component} from 'react';
import * as base from "../base.js"
import {axios} from "../base.js"
import CCalendar from "./components/c_calendar.js"
import css from "./css/ireading.css"


const BaseHost = base.BaseHostIreading();
import Moment from "moment"
import CSeperator from "./components/c_sperator";
import stopPng from "../../resource/imgs/stop.png";
import playPng from "../../resource/imgs/play.png";
import arrayLeftPng from "../../resource/imgs/array_left.png"
import arrayRightPng from "../../resource/imgs/array_right.png"
import CShareContent from "./components/c_share_content";
import CSignin from "./components/c_sigin";

export default class Signin extends Component
{

  constructor(props)
  {
    super(props);
  }

  render(){
    return (
      <div>
          <CSignin></CSignin>
      </div>
    );
  }
}

const inner_style = {
}