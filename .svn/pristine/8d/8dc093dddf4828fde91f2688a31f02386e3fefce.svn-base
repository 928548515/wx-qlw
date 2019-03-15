// pages/my/page/appointment/service-detail/service-detail.js
const app = getApp();
const dateFormat = require("../../../../../utils/dateFormat.js");
const upload = require("../../../../../apis/upload.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    const id = opt.id
    this.initData(opt.id)
  },
  toBack(){
    wx.navigateBack({
      delta:1
    })
  },
  //跳到预约详情页
  toAppointmentInfo(e) {
    let temp = e.currentTarget.dataset.appointment
    wx.navigateTo({
      url: '/pages/my/page/appointment/appointment-info/appointment-info?item=' + JSON.stringify(e.currentTarget.dataset.appointment),
    })
  },
  initData(orgId) {
    app.globalData.http("/serviceSite/getServiceSite", "post", {
      organizationId: orgId
    }).then(res => {
      if (res.data.status == 200) {
        const formatPattern = "yyyy年MM月dd日"
        res.data.data.establishDate = dateFormat(res.data.data.establishDate, formatPattern)
        res.data.data.creationTime = dateFormat(res.data.data.creationTime, formatPattern)

        // let i = 0;
        // for (let j = 0; j < 10; j++) {
        //   res.data.data.pictureUrl.push({
        //     targetType: 9,
        //     refId: res.data.data.organizationId,
        //     imageId: i++,
        //     imageName: "imageName",
        //     imageTitile: "imageTitile",
        //     imageUrl: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1475014254,2843339190&fm=26&gp=0.jpg",
        //     imageSize: "10",
        //     imageExt: "jpg",
        //     thumbnailUrl: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1475014254,2843339190&fm=26&gp=0.jpg",
        //     crationTime: res.data.data.crationTime + i
        //   })
        // }
        this.setData({
          item: res.data.data
        })
      } else {
        wx.showToast({
          title: '获取失败！',
          icon: "none"
        })
      }
    })
  },
  //证书查看大图
  showCradImageInfo(){
    let index = e.currentTarget.dataset.index; //图片索引
    let curUrl = this.data.item.orgCardImgs[index].imageUrl; //当前点击的图片url
    let urls = this.data.item.orgCardImgs.map(x => x.imageUrl) //原图列表
    wx.previewImage({ //显示原图
      urls,
      current: curUrl
    })
  },
  //查看大图
  showImageInfo(e) {
    let index = e.currentTarget.dataset.index; //图片索引
    let curUrl = this.data.item.pictureUrl[index].imageUrl; //当前点击的图片url
    let urls = this.data.item.pictureUrl.map(x => x.imageUrl) //原图列表
    wx.previewImage({ //显示原图
      urls,
      current: curUrl
    })
  },
  //上传图片
  uploadImg(e) { //上传宠物图片
    let orgId = this.data.item.organizationId;
    upload(9, orgId, false) //logo图片
    setTimeout(()=>{
      this.initData(orgId)
    },5000);
  },
  delImage(e) { //删除图片
    let index = e.currentTarget.dataset.index; //图片索引
    let curPid = this.data.item.pictureUrl[index].imageId;
    wx.showModal({
      "title": "删除确认",
      "content": "将删除这张图片？",
      showCancel: true,
      confirmText: "狠心删除",
      confirmColor: "#F92627",
      cancelColor: "#3cc51f",
      success: (res) => {
        if (res.confirm) {
          app.globalData.http('/fileManager/' + curPid, "delete")
            .then(res => {
              if (res.data.meta.success) {
                wx.showToast({
                  title: '删除成功！',
                })
                this.data.item.pictureUrl.splice(index, 1);
                this.setData({
                  item: this.data.item
                })
              } else {
                wx.showToast({
                  title: '删除失败！',
                  "icon": "none"
                })
              }
            })
        }
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