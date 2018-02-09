import wx from 'weixin-js-sdk'
import {axios} from "../betterme/base.js"

export default function init_share(url)
{
  const ua = window.navigator.userAgent.toLowerCase()
// 如果不在微信浏览器内，微信分享也没意义了对吧？这里判断一下
  if (ua.indexOf('micromessenger') < 0){
    console.log("init_share 不是微信里")
    return false
  }

// 最好在在 router 的全局钩子里调用这个方法，每次页面的 URL 发生变化时，都需要重新获取微信分享参数
// 如果你的 router 使用的是 hash 形式，应该不用每次都重新获取微信分享参数
  const data = axios.get(url).then((r) => {

    console.log("init_share",res);
    var res = r.data;

    var {appId, timestamp, nonceStr, signature} = res.config;
    var {url, title, desc} = res;

    wx.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appId, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: nonceStr, // 必填，生成签名的随机串
      signature: signature,// 必填，签名，见附录1
      jsApiList: [
        'onMenuShareAppMessage',
        'onMenuShareTimeline'
      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })


    wx.ready(() => {
      //分享给朋友
      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: '', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          // 用户确认分享后执行的回调函数
          console.log("onMenuShareAppMessage ok")
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
          console.log("onMenuShareAppMessage fail")
        }
      })

      //分享到朋友圈
      wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: '', // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
          console.log("onMenuShareTimeline ok")
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
          console.log("onMenuShareTimeline fail")
        }
      })
    })


  }).catch(e => {
    console.error(e);
  })
}
