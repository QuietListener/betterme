import { hashHistory } from 'react-router'
import moment from "moment"

export const DayMinSeconds = 24*60*60*1000;
export const slogon = "做更好的自己"
export const BaseHost = "http://localhost:3000"
//export const BaseHost = `http://www.coderlong.com`
export const IMG_BASE = `${BaseHost}/upload/`

const history = hashHistory;
export function goto(path)
{
  history.push(path)
}

//---网络库---
const headers ={
  Cookie: "access_token=7110eda4d09e062aa5e4a390b0a572ac0d2c0220596;"
}

const UserAgent = "oniu_0.1/1.0.2";
const HttpTimeout = 10000//毫秒

import axios_ from "axios"
const instance = axios_.create({timeout: HttpTimeout,headers:headers});
instance.defaults.headers.common["User-Agent"] = UserAgent;
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

export function today()
{
  return moment().format("YYYY-MM-DD");
}


export const COLOR={
  blue:"rgb(0, 188, 212)",
  red:"rgb(255, 64, 129)",
  gray:"#f2f2f2",
  yellow:"#FFEB3B"

}

export const slogon1 = "小目标实现大梦想"