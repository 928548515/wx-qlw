//app.js
var config = require("/apis/config.js")
var request = require("./apis/request_sync.js");
App({
  globalData: {
    basicUrl: config.BASE_URL,
    picBaseUrl: config.PIC_BASE_URL, //图片服务器路径
    token: "",
    userInfo: "", //全局用户信息
    isShowTosal: false,
    http: request.asynHttp
  },



  //登录是否失效
  isLoginExpire: function(res) {
    var that = this;
    var isexpire = false;
    if (!res.header) {
      return;
    }
    var statusCode = res.header.statusCode;
    //若statusCode存在，判断statusCode值
    if (statusCode) {
      var status = parseInt(statusCode);
      //如果状态码等于401，token过期
      if (status == 401) {
        that.globalData.userInfo = "";
        //清空本地内存信息
        wx.clearStorageSync();
        that.globalData.isShowTosal = true;
        isexpire = true;
        wx.showToast({
          title: '登录超时',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      }
    }
    return isexpire;
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
    var that = this;
    const token = wx.getStorageSync("token");
    //将token添加到全局变量中
    if (token) {
      //将用户信息放入app
      that.globalData.token = token;
    }
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      that.globalData.userInfo = userInfo;
      return;
    }

    //检查版本更新
    this.checkNewVersion();
  },

  //获取session
  getSession: function(fun) {

    var that = this;
    wx.login({
      success: function(res) {
        //获取临时凭证
        var code = res.code;
        //发送请求获取session_key
        wx.request({
          url: config.BASE_URL + "/getToken",
          data: {
            code: code
          },
          method: 'GET',
          success: function(res) {
            var session_key = res.data;
            //将session_key存入本地
            wx.setStorageSync("token", session_key)
            that.globalData.token = session_key;
            typeof fun == "function" && fun();
          },
          fail: function(res) {
            console.log(res.data)
          },
        })
      },
    })
  },


  /**
   * 获取用户信息
   */
  getUserInfo: function() {
    var user = this.globalData.userInfo;
    return user;
  },



  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },


  //检测小程序是否有新版本
  checkNewVersion: function() {
    //获取全局唯一的版本更新管理器，用于管理小程序更新
    const updateManager = wx.getUpdateManager();

    //监听向微信后台请求检查更新结果事件。微信在小程序冷启动时自动检查更新，不需由开发者主动触发。
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        wx.showLoading({
          title: '下载中...',
        })
      }
    })

    //监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
    updateManager.onUpdateReady(function() {
      wx.hideLoading();
      wx.showModal({
        title: '更新提示',
        content: '新版本已下载完毕，请点击确定更新',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            //制小程序重启并使用新版本。在小程序新版本下载完成后（即收到 onUpdateReady 回调）调用。
            updateManager.applyUpdate();
          }
        }
      })
    })

    // 新版本下载失败
    updateManager.onUpdateFailed(function() {
      wx.hideLoading();
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败，请检查网络并重新更新',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            console.log("下载新版本失败")
          }
        }
      })
    })
  },

})