// pages/home/notice/notice.js
var request = require("../../../apis/request.js");
var config = require("../../../apis/config.js");
var dateUtiles = require("../../../utils/dateUtils.js");
var dateFormat = require("../../../utils/dateFormat.js");

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishasData: true,
    dogs: [{
      url: "/assets/dogs/dog2.png",
      name: "小红",
      breed: "金毛",
      sex: 0,
      age: 3,
      color: "黄白"
    }, {
      url: "/assets/dogs/dog2.png",
      name: "小红",
      breed: "金毛",
      sex: 0,
      age: 3,
      color: "黄白"
    }],
    adoptdogs:[],
    maxLength: 6, //默认最大显示8个
    //可领养犬只
    params: {
      pn: 1,
      pageSize: 6,
      status:1,
      totalCount:0
    }
  },


  /**
   * 获取领养犬只
   */
  getAdoptdogs: function (isAppend = false) {
    var that = this;
    app.globalData.http("/adoption/findPublishingList", "get", that.data.params)
          .then(res => {
        var data = res.data.data;
        if (!data || data.length <= 0) {
          that.setData({
            ishasdata: false
          })
          return;
        }
        //获取list列表
        var adoptdogs = res.data.data.lists;
        if (isAppend) {
          adoptdogs.concat(that.data.adoptdogs)
        }
        that.data.params.totalCount = res.data.data.totalRecord;
        if (adoptdogs && adoptdogs != '') {
          that.setData({
            adoptdogs: adoptdogs,
            params: that.data.params
          })
        }
      // },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 跳转到犬只详情页面
   */
  ToAdoptDog:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var adoptdog_index = that.data.adoptdogs[index];
    wx.navigateTo({
      url: '/pages/home/adoption/adoption?adoptdog_index=' + JSON.stringify(adoptdog_index),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.getAdoptdogs();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.setData({
    //   maxLength: this.data.maxLength * 2,
    //   param: {
    //     pn: this.data.params.pn + 1,
    //     pageSize: 6,
    //     status: 1
    //   }
    // });
    this.getAdoptdogs();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.params.totalCount > this.data.notice.length) {
      this.data.params.pageNum = this.data.params.pageNum + 1;
      this.getAdoptdogs(true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})