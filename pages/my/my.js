// pages/my/my.js
var app = getApp();
var config = require("../../apis/config.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: true,
    userInfo: ''
  },

  //更新用户信息
  getUserInfos: function() {
    var that = this;
    wx.request({
      url: config.BASE_URL + '/getUSerInfo',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": app.globalData.token
      },
      method: 'post',
      dataType: 'json',
      success: function(res) {
        //判断是否过期
        var isexpire = app.isLoginExpire(res);
        if (isexpire) {
          that.setData({
            isLogin: false,
          })
          return;
        } else {
          if (res.data.status == 200) {
            var userInfo = res.data.data;
            wx.setStorageSync("userInfo", userInfo);
            that.setData({
              userInfo: userInfo
            })
          }
        }
      },
    })
  },

  isloginEvent: function() {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo == "") {
      var userInfo = {};
      userInfo.name = "请登录",
        that.setData({
          isLogin: false,
          userInfo: userInfo,
        })
      return;
    } else {
      that.getUserInfos();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //退出登录
  logout() {
    app.globalData.http("/logout").then(res => {
        wx.clearStorageSync();
        app.globalData.userInfo = {};
        wx.reLaunch({
          url: '/pages/login/login',
        })
      })
      .catch(res => {
        wx.showToast({
          title: '登出失败！',
          icon: 'none'
        })
      })
  },
  //点击登录跳转到登录页面
  tologinPage: function() {
    var userInfo = app.getUserInfo();
    //如果没有user信息,挑战到登录页
    if (!userInfo || !userInfo.userId) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  toMyData() {
    var userInfo = app.getUserInfo();
    //如果没有user信息,挑战到登录页
    if (userInfo && userInfo.userId) {
      wx.navigateTo({
        url: '/pages/my/page/myData/myData',
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  //跳转到我的犬证
  todogCard: function() {
    var userInfo = app.getUserInfo();
    if (!userInfo || userInfo.length <= 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/my/page/card/card',
    })
  },

  //跳转到我的宠物
  todogPet: function() {
    var userInfo = app.getUserInfo();
    if (!userInfo || userInfo.length <= 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/my/page/pet/pet?dogOwnerId=' + this.data.userInfo.dogOwnId,
    })
  },

  //跳转到活动轨迹
  todogRoute: function() {
    var userInfo = app.getUserInfo();
    if (!userInfo || userInfo.length <= 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/my/page/dog_route/dog_route?dogOwnerId=' + this.data.userInfo.dogOwnId,
    })
  },

  //跳转到业务预约
  toAppointment: function() {
    var userInfo = app.getUserInfo();
    if (!userInfo || userInfo.length <= 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/my/page/appointment/appointment?dogOwnerId' + this.data.userInfo.dogOwnId,
    })
  },

  //跳到logout
  tologout: function() {
    var userInfo = app.getUserInfo();
    if (!userInfo || userInfo.length <= 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/my/page/logout/logout'
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.isloginEvent();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})