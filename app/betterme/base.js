import { hashHistory } from 'react-router'
import moment from "moment"
export const maxWidth = 800;
export const DayMinSeconds = 24*60*60*1000;
export const slogon = "做更好的自己"
export const BaseHost = "http://localhost:3000"
export function BaseHostIreading() {
  return "http://localhost:3100"
  //return "https://freepic.store"
}

export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
//export const BaseHost = `http://www.coderlong.com`
export const IMG_BASE = `${BaseHost}/upload/`

const history = hashHistory;
export function goto(path)
{
  console.log("goto ", path);
  history.push(path)
}

export function back(step)
{
  console.log("goto step ", step);
  history.go(-step)
}

export function width() {
  let w1 =  document.body.clientWidth || window.innerWidth;
  let w2 = maxWidth;

  console.log("w1 w2",w1,w2);
  if(w1 < w2){
    return w1;
  }

  return w2;

}

export function height() {
  return document.body.clientHeight || window.innerHeight;
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
  gray1:"#494949",

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


export function timestamp()
{
  return Date.parse(new Date());
}
export const URLS = {
  all_articles: {
    url: () => `${BaseHostIreading()}/reading/show_articles.json?timestamp=${timestamp()}`,
    name: 'all_articles'
  },
  finished_articles: {
    url: () => `${BaseHostIreading()}/reading/finished_articles.json?timestamp=${timestamp()}`,
    name: 'finished_articles'
  },
  signin:{
    url: () => `${BaseHostIreading()}/reading/signin.json?timestamp=${timestamp()}`,
    name: 'user_info'
  },
  login:{
    url: () => `${BaseHostIreading()}/reading/login.json?timestamp=${timestamp()}`,
    name: 'user_info'
  }
}

export function getValue(key){
  var result = null;
  if(window.Android) {
    result = window.Android.getValue(key);
  }else if (window.localStorage){
    let storage = window.localStorage;
    result = storage[key];
  }
  return result;
}


export function putValue( key , value){
  var result
  if(window.Android) {
    result = window.Android.putValue(key,value);
  }else if(window.localStorage){
    let storage = window.localStorage;
    storage[key]=value;
  }
  return result;
}

export function setLan(lan){
     console.log("base setLan,lan");
     putValue("language",lan);
}

export function getLan(){
  
  var lan_ =  getValue("language");
  if(lan_ == null){
    lan_ = getBrowerLan();
  }
  console.log("base getLan ",lan_);
  //return "en-us";
  return lan_;
}


export function isZh(){
  console.log("base getTipByLan");
  var lan = getLan();

  var choosedLan = lan;
  if(lan.indexOf('zh')>=0){
    return true;
  }

  return false;
}



export function getTipByLan(){
  console.log("base getTipByLan");
  var lan = getLan();

  var choosedLan = lan;
  if(lan.indexOf('zh')>=0){
    if(lan.indexOf('cn')>0){
      choosedLan = Languages.ZhCN.name; //是简体中文就返回简体中文
    }else{
      choosedLan = Languages.ZhTw.name; //否则返回繁体
    }
  }
  else{
    choosedLan = Languages.EnUs.name; //否则返回英语
  }
  return TipByLan[choosedLan];
}

export function getBrowerLan(){
  var jsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();
  return jsSrc;
}

export const Languages = {
  ZhTw:{
    name:"zh-tw",
    displayName:"中文繁体"
    },
  ZhCN:{
    name:"zh-cn",
    displayName:"中文简体"
  },
  EnUs:{
    name:"en",
    displayName:"English"
  }
}

// 取得cookie
export function getCookie(name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';') // 把cookie分割成组
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i] // 取得字符串
    while (c.charAt(0) == ' ') { // 判断一下字符串有没有前导空格
      c = c.substring(1, c.length) // 有的话，从第二位开始取
    }
    if (c.indexOf(nameEQ) == 0) { // 如果含有我们要的name
      return unescape(c.substring(nameEQ.length, c.length)) // 解码并截取我们要值
    }
  }
  return null
}

// 设置cookie
export function setCookie(name, value, seconds) {
  seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
  var expires = "";
  if (seconds != 0 ) {      //设置cookie生存时间
    var date = new Date();
    date.setTime(date.getTime()+(seconds*1000));
    expires = "; expires="+date.toGMTString();
  }
  document.cookie = name+"="+escape(value)+expires+"; path=/";   //转码并赋值
}


export function getAccessToken(){
  return getCookie("access_token");
}

var tipCn = {
  share_1:"我在",
  share_2:"上，坚持阅读了",
  share_3:"天",
  share_4:"学完了",
  share_5:"篇英文文章",

  statistics_1:"单词",
  statistics_2:"天",
  statistics_3:"文章",

  logout:"退出",
  collectWords:"收藏的单词",
  no_finished_articles_tip:"还没有完成的文章喔~",
  commit:"评论",
  commitTip:"我有话想说",
  settingTip:"设置",
  settingLan:"设置语言",
  toofast:"读得太快了吧",
  shareTo:"分享到"
};

var tipTw={
  share_1:"我在",
  share_2:"上，堅持閱讀了",
  share_3:"天",
  share_4:"學完了",
  share_5:"篇英文文章",
  statistics_1:"單詞",
  statistics_2:"天",
  statistics_3:"文章",
  logout:"退出",
  collectWords:"收藏的單詞",
  no_finished_articles_tip:"還沒有完成的文章喔~",
  commit:"評論",
  commitTip:"我有話想說",
  settingTip:"設置",
  settingLan:"設置語言",
  toofast:"讀得太快了吧",
  shareTo:"分享到"
}

var tipEnUs={
  share_1:"我在",
  share_2:"上，堅持閱讀了",
  share_3:"天",
  share_4:"學完了",
  share_5:"篇英文文章",
  statistics_1:"Words",
  statistics_2:"Days",
  statistics_3:"Articles",
  logout:"Logout",
  collectWords:"Collected Words",
  no_finished_articles_tip:"no finished articles yet~",
  commit:"submit",
  commitTip:"I want say something",
  settingTip:"Settings",
  settingLan:"Language",
  toofast:"slow down~ ",
  shareTo:"Share to "
}


var TipByLan_ = {}
TipByLan_[Languages.ZhTw.name] = tipTw;
TipByLan_[Languages.ZhCN.name] = tipCn;
TipByLan_[Languages.EnUs.name] = tipEnUs;
export const TipByLan = TipByLan_;
