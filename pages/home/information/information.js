// pages/home/notice/notice.js
var request = require("../../../apis/request.js");
var config = require("../../../apis/config.js");
var dateUtiles = require("../../../utils/dateUtils.js");
var dateFormat = require("../../../utils/dateFormat.js");

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishasData: true,
    notice: [],
    maxLength: 6, //默认最大显示8个
    //可领养犬只
    params: {
      pageNum: 1,
      pageSize: 6,
      totalCount: 0
    }
  },

  getInformations(isAppend = false) {
    var that = this;
    var Info_type = that.data.Info_type;
    var params = that.data.params;
    params.type = Info_type; //资讯类型
    app.globalData.http("/information/list", "get", params).then(res => {
      if (res.data.meta.success) {
        let notice = res.data.data.list;
        if (!notice || notice.length == 0) {
          that.setData({
            ishasData: false,
          })
          return;
        }
        for (var i = 0; i < notice.length; i++) {
          var images = notice[i].images;
          if (images == null || images.length == 0) {
            notice[i].imgUrl = "/assets/title/info.png";
          } else {
            notice[i].imgUrl = images[0].thumbnailUrl;
          }
          notice[i].creationTime = dateFormat(notice[i].creationTime, 'yyyy/MM/dd HH:mm:ss');
        }
        if (isAppend) {
          notice = that.data.notice.concat(notice);
        }
        that.data.params.totalCount = res.data.data.total;
        that.setData({
          notice: notice,
          params: that.data.params
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var Info_type = options.Info_type;
    that.setData({
      Info_type: Info_type
    })
    let navTitile = options.infoTitle

    wx.setNavigationBarTitle({
      title: navTitile
    })
  },

  bindnavigate: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var notice_index = that.data.notice[index];
    wx.navigateTo({
      url: '/pages/home/information/information_desc/information_desc?id=' + notice_index.informationId,
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
    that.getInformations();
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
    this.getInformations();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.params.totalCount > this.data.notice.length) {
      this.data.params.pageNum = this.data.params.pageNum + 1;
      this.getInformations(true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})