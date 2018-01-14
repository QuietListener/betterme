import { hashHistory } from 'react-router'
import moment from "moment"

export const slogon = "做更好的自己"
export const BaseHost = "http://localhost:3000"
export const IMG_BASE = "http://localhost:3000/upload/"

const history = hashHistory;
export function goto(path)
{
  history.push(path)
}

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
  gray:"#f2f2f2"

}

export const slogon1 = "小目标实现大梦想"