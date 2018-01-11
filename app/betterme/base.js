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

export function formatDateTime(str)
{
  var m = moment(str);
  var f = m.format("YYYY-MM-DD h:mm:ss")
  return f;
}
