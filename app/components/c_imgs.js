import React, {Component} from 'react';
import config from '../conf/config.json';
import _ from "lodash"
import * as base from "../betterme/base.js"
import Dialog from 'material-ui/Dialog';

export default class CImgs extends Component
{
  constructor(props)
  {
    super(props);

    var img = this.props.imgs[this.props.index];

    this.state = {
      imgs:this.props.imgs,
      index:this.props.index,
      img:img,
      show_dialog:false
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle()
  {
    this.setState({show_dialog:!this.state.show_dialog});
  }

  next()
  {
    var index = this.state.index;

    if(index >= this.state.imgs.length-1)
      return;

    index += 1;
    this.setState({index:index})
  }

  pre()
  {
    var index = this.state.index;

    if(index <=0)
      return;

    index -= 1;
    this.setState({index:index})
  }

  render()
  {

    var img = this.state.imgs[this.state.index];

    var pre = <div style={{display:"inline-block",verticalAlign:"top",margin:'4px'}}
                   onClick={()=>this.pre()}>上一张</div>;

    var next = <div style={{display:"inline-block",verticalAlign:"top",margin:"4px"}}
                    onClick={()=>this.next()}
        >下一张</div>

    if(this.state.index >= this.state.imgs.length-1)
      next = null;
    if(this.state.index <= 0)
      pre = null;

    var dialog = null;

    dialog = <Dialog
      actions={[]}
      modal={false}
      contentStyle={customContentStyle}
      open={this.state.show_dialog}
      onRequestClose={this.toggle}
    >
      <div style={{height: "90%", textAlign:"center"}}>
        <img style={Object.assign({height: "76%"},imgStyle)} src={img}/>

        <div style={{width: "100%", textAlign: "center",padding:"6px"}}>
          {pre}{next}
        </div>
      </div>


    </Dialog>


    return(<div style={{height:this.props.height}}>
        <img src={this.state.img} style={Object.assign({height:this.props.height||"80px"},imgStyle)} onClick={()=>this.toggle()} />
        {dialog}
      </div>
    );
  }
}


const customContentStyle = {
  width: '90%',
  height:'90%',
  maxHeight:'none',
  maxWidth: 'none',
};

const imgStyle = {
  border:"1px solid #f2f2f2",
  borderRadius:"2px"
}