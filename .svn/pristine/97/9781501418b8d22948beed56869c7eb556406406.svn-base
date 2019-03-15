// pages/home/forbid/forbid.js
const {
  asynHttp: http
} = require("../../../apis/request_sync.js");
const dateFormat = require("../../../utils/dateFormat.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishasData: true,
    forbid_dogs: [],
    page: {
      num: 1,
      size: 20,
      totalCount: 0
    }

  },
  //禁养详情页
  tobanDetail(e) {
    wx.navigateTo({
      url: "/pages/home/noPetDetail/noPetDetail?item=" + JSON.stringify(e.currentTarget.dataset.item)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  initData(isAppend = false) {
    http("/ban/findAll", "get", {
      pn: this.data.page.num,
      pageSize: this.data.page.size
    }).then(res => {
      if (res.data.status == 200) {
        let forbid_dogs = res.data.data.lists;
        if (isAppend) {
          forbid_dogs = forbid_dogs.concat(this.data.forbid_dogs);
        }
        forbid_dogs.map(x=>{
          x.creationTime = dateFormat(x.creationTime,"yyyy/MM/dd HH:mm:ss")
        })
        this.data.page.totalCount = res.data.data.totalRecord;
        this.setData({
          forbid_dogs: forbid_dogs,
          page: this.data.page
        })
      }
    })
    return;
    http("/dogAndOwner/selectDogBanList", "get", {
      num: this.data.page.num,
      size: this.data.page.size,
    }).then(res => {
      if (res.data.code == '000000') {
        let forbid_dogs = res.data.result.dogInfos;
        if (isAppend) {
          forbid_dogs = forbid_dogs.concat(this.data.forbid_dogs);
        }
        this.data.page.totalCount = res.data.result.page.totalCount;
        this.setData({
          forbid_dogs: forbid_dogs,
          page: this.data.page
        })
      }
    })
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
    if (this.data.page.totalCount > this.data.forbid_dogs) {
      this.data.page.num = this.data.page.num + 1
      this.initData(true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})