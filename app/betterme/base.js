import { hashHistory } from 'react-router'
import moment from "moment"

export const slogon = "做更好的自己"
export const BaseHost = "http://localhost:3000"


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
