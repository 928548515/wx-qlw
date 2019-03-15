// pages/my/page/dog_route/dog_route.js
var amapFile = require('../../../../apis/amap-wx.js'); //如：..­/..­/libs/amap-wx.js
var config = require("../../../../apis/config.js");
var request = require("../../../../apis/request.js");
var utils = require("../../../../apis/util.js");

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishasData:true,
    dogs: []
  },


  //跳转到路径页面
  toDogRoute:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var dog_index = that.data.dogs[index];
    wx.navigateTo({
      url: '/pages/my/page/dog_route/route/route?dog_index=' + JSON.stringify(dog_index),
    })
  },

  getDogs: function (options){
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo == "") {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }else{
      var ownId = app.globalData.userInfo.dogOwnId;
      wx.request({
        url: config.BASE_URL + '/dogAndOwner/selectMyDogs',
        data: {
          ownerId: ownId,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": app.globalData.token
        },
        method: 'GET',
        success: function (res) {
          //判断是否过期
          var isexpire = app.isLoginExpire(res);
          if (isexpire) {
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }, 1500)
            return;
          }
          var data = res.data.result;
          if (!data || data.length <= 0) {
            that.setData({
              ishasData: false
            })
            return;
          }
          res.data.result =  res.data.result.filter(x => x.bindStatus==0)//沒有半綁定 設備無法查看軌跡信息
          that.setData({
            dogs: res.data.result
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var dogOwnerId = options.dogOwnerId;
    that.setData({
      dogOwnerId: dogOwnerId
    })
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
    var that = this;
    that.getDogs();
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