

export default class RNWebviewMessager
{
  constructor()
  {
    this.call_backs={};
    this.id = 0;

    var that = this;
    //alert("init...");
    window.document.addEventListener('message', function (e) {
      const message = e.data;

      console.log(`from RN:${message}`);
  
      var ret = JSON.parse(message);
      var {id, method, result} = JSON.parse(message);
      var call_back = that.call_backs[id.toString() ];

      alert(`${call_back} is ${call_back}: id=${id}, method=${method},result=${JSON.stringify(result)}`)
      //result必须为数组
      if(call_back != null)
        call_back(...result);
    })
  }


   // share_data = {"url": url, "title": title, "desc": desc, "img": img, "share_type": share_type||"", "share_media": share_media||""}
  share(share_data,call_back) {
    var cmd = "share";
    var share_data_ = {web_url:share_data.url, img_url:share_data.img, title:share_data.title, desc:share_data.desc};
    this.call(cmd, share_data_ , call_back);
   }

  call(method, args, call_back)
  {
      var command = {method, args}
      this.id = this.id+=1;
      var id = this.id;
      var command_ = {id,command}

      var msg = JSON.stringify(command_);
      console.log("to RN:"+msg);
      this.call_backs[id.toString()]=call_back;

      alert(`to native msg:${JSON.stringify(msg)}`);
      window.postMessage(msg);
  }
}

