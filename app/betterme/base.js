import { hashHistory } from 'react-router'

export const slogon = "做更好的自己"

const history = hashHistory;

export function goto(path)
{
  history.push(path)
}