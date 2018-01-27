import { hashHistory } from 'react-router'
import moment from "moment"

export const DayMinSeconds = 24*60*60*1000;
export const slogon = "做更好的自己"
//export const BaseHost = "http://www.coderlong.com:3000"
export const BaseHost = "http://192.168.1.100:3000"
export const IMG_BASE = `${BaseHost}/upload/`

const history = hashHistory;
export function goto(path)
{
  history.push(path)
}

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
  var f = m.format("YYYY-MM-DD h:mm:ss")
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