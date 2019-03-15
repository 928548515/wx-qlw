const app = getApp()
var dateFormat = require("../../../../utils/dateFormat.js");
const WxParse = require("../../../../components/wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info_desc: {
      title: "西宁市养犬登记办理指南",
      view_count: 1000,
      source: "西宁市犬只办",
      pubdate: "2018-3-2",
      content: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    var that = this;
    app.globalData.http("/information/detail/" + opt.id, "GET")
    .then(res => {
      if(res.data.meta.success){
        const d = res.data.data;
        res.data.data.creationTime = dateFormat(res.data.data.creationTime, "yyyy/MM/dd HH:mm:ss");
        let article = res.data.data.infoContent;
        article = article ? article:'无'
        console.log(article.length)
        console.log(article)
        WxParse.wxParse('article', 'html', article, that, 5);   // 实例化对象
        this.setData({
          info_desc: res.data.data
        })
      }
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