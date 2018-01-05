import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"

class PlanDetails extends Component{

  constructor(props)
  {
    super(props)
  }

  render(){
    return <div onClick={()=>this.props.test("lalala")}>details</div>
  }
}




import { connect } from "react-redux";
import {TEST,test} from "./redux/actions/actions"


const mapStateToProps = state => {
  return {
    test: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    test: txt => {
      dispatch(test(txt))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanDetails);