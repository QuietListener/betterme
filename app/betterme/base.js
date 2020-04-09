import { hashHistory } from 'react-router'
import moment from "moment"

export const DayMinSeconds = 24*60*60*1000;
export const slogon = "做更好的自己"
export const BaseHost = "http://localhost:3000"
export function BaseHostIreading() {
  return "http://localhost:3100"
  //return "https://freepic.store"
}

//export const BaseHost = `http://www.coderlong.com`
export const IMG_BASE = `${BaseHost}/upload/`

const history = hashHistory;
export function goto(path)
{
  history.push(path)
}

export function width() {
  return document.body.clientWidth || window.innerWidth;
}

//---网络库---
const headers ={
  //Cookie: "access_token=7110eda4d09e062aa5e4a390b0a572ac0d2c0220596;"
}

const UserAgent = "oniu_0.1/1.0.2";
const HttpTimeout = 18000//毫秒

import axios_ from "axios"
const instance = axios_.create({timeout: HttpTimeout,headers:headers});
//instance.defaults.headers.common["User-Agent"] = UserAgent;
instance.defaults.withCredentials = true

export const axios = instance


export const DateFormat = "YYYY-MM-DD";

export function formatDate(str)
{
  var m = moment(str,"YYYY-MM-DD");
  var f = m.format("YYYY-MM-DD")
  return f;
}
export function formatDate1(date)
{
  var m = moment(date)
  return m.format("YYYY-MM-DD");
}
export function formatDateTime(str)
{
  var m = moment(str);
  var f = m.format("YYYY-MM-DD HH:mm:ss")
  return f;
}

export function trim(str,count){

}
export function today()
{
  return moment().format("YYYY-MM-DD");
}

export function trimStr(str){
  return str.replace(/\"/g,"").replace(/”/g,"");
}

export const COLOR={
  blue:"rgb(0, 188, 212)",
  red:"rgb(255, 64, 129)",
  gray:"#f2f2f2",
  yellow:"#FFEB3B",
  green:"green",

}

export const slogon1 = "小目标实现大梦想"

export function scrollAnimation(currentY, targetY,elem) {
  // 获取当前位置方法
  // const currentY = document.documentElement.scrollTop || document.body.scrollTop

  elem == null ? window : elem;

  // 计算需要移动的距离
  let needScrollTop = targetY - currentY
  let _currentY = currentY
  setTimeout(() => {
    // 一次调用滑动帧数，每次调用会不一样
    const dist = Math.ceil(needScrollTop / 10)
    _currentY += dist
    elem.scrollTo(0, currentY)
    // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
    if (needScrollTop > 10 || needScrollTop < -10) {
      scrollAnimation(_currentY, targetY,elem)
    } else {
      elem.scrollTo(0, targetY)
    }
  }, 1)
}
