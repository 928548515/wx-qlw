var icons = require("./js/icon.js"); //引入配置文件文件
var request = require("../../apis/request_sync.js");
var config = require("../../apis/config.js");
var dateUtiles = require("../../utils/dateUtils.js");
var dateFormat = require("../../utils/dateFormat.js");
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: true, //是否登录
    ishasData: true,
    isShow: false,
    notices: [],
    params: {
      offset: 1,
      limit: 8,
      totalCount: 0
    },
    msgType: {
      array: ["未读消息", "已读消息", "全部消息" ],
      index: 2
    },
    allMsg: false,
  },
  msgTypeChange(e) {
    this.data.msgType.index = e.detail.value;
    this.data.params.offset = 1;
    this.setData({
      msgType: this.data.msgType,
      params: this.data.params
    })
    this.getNotices();
  },
  msgChanged() {
    this.setData({
      allMsg: !this.data.allMsg
    })
  },

  //获取通知
  getNotices: function(isAppend = false) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo == "") {
      that.setData({
        isLogin: false,
      })
      return;
    } else {
      var userId = userInfo.userId;
      var params = {};
      if (this.data.msgType.index == 2 ){
        params.receiverd = userId,
        params.offset = that.data.params.offset,
        params.limit= that.data.params.limit
      }else{
          params.receiverd = userId,
          params.offset = that.data.params.offset,
          params.limit = that.data.params.limit,
          params.status = this.data.msgType.index
      }
      app.globalData.http("/notice/selectNoticeByReceiverd", "POST", params).then(res => {
        if (res.data.status == 200) {
          //图像处理
          res.data.data.list.map(x => {
            if(x.notifType == 1){  //免疫
              x.iconUrl = "/assets/message/immune-icon.png"
            } else if (x.notifType == 2) { //预约
              x.iconUrl = "/assets/message/sub-icon.png"
            } else if (x.notifType == 3) { //喂药
              x.iconUrl = "/assets/message/drug-icon.png"
            } else if (x.notifType == 4) { //领养
              x.iconUrl = "/assets/message/adopt-icon.png"
            } else if (x.notifType == 5) { //处罚
              x.iconUrl = "/assets/message/punish-icon.png"
            }  else if (x.notifType == 6) { //电量告警
              x.iconUrl = "/assets/message/warn-icon.png"
            } else if (x.notifType == 7) { //禁养区域
              x.iconUrl = "/assets/message/disabled-icon.png"
            } else if (x.notifType == 8) { //审核
              x.iconUrl = "/assets/message/examine-icon.png"
            }else { //其他
              x.iconUrl = "/assets/message/other-icon.png"
            }
          })
          res.data.data.list.map(x => x.creationTime = dateFormat(x.creationTime, "MM-dd HH:mm"))
          if (isAppend) {
            res.data.data.list = that.data.notices.concat(res.data.data.list);
          }
          that.data.params.totalCount = res.data.data.total
          that.setData({
            notices: res.data.data.list
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getNotices();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // this.setData({
    //   maxLength: this.data.maxLength * 2,
    //   param: {
    //     offset: this.data.params.offset + 1,
    //     limit: 6
    //   }
    // });
    this.getNotices();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.notices.length < this.data.params.totalCount) {
      this.data.params.offset = this.data.params.offset + 1
      this.setData({
        params: this.data.params
      })
      this.getNotices(true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})