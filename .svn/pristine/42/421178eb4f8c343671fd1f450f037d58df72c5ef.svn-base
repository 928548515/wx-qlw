// pages/my/page/dogCard.js
const dateFormat = require('../../../../utils/dateFormat.js');
const config = require('../../../../apis/config.js');
const basicUrl = config.BASE_URL;
const QR = require('../../../../utils/wxqrcode.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishasData: true,
    dogCradInfos: [{
      showView: true, //控制犬证正反面
      //犬证信息
      dogCardNum: 'dogCardNum', //犬证号
      markNum: 'markNum', //标示号/设备编号
      dogVarieties: 'dogVarieties', //品种
      color: 'color', //毛色
      yearCheckDate: 'color', //年检时间
      dogUrl: '/assets/dogs/forbiddog_1.png', //犬图
      //犬主信息 反面
      dogOwnersName: 'dogOwnersName', //犬主姓名
      phone: 'phone', //电话
      address: 'address', //养犬地址
      issuanceUnit: 'issuanceUnit', //签发单位
      startDate: dateFormat(new Date(), 'yyyy-MM-dd'), //初始签发日期
      qrcode: { //二维码图片
        text: '',
        img: ''
      }
    }],
    MaxCount: 3, //显示几张
    qrcodeSize: 0, //屏幕尺寸
    dogOwnerId: '' //犬主id
  },

  getCard:function(){
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo == "") {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }else{
      that.setData({ dogCradInfos: [] });
      that.initData(); //查询犬只信息
      that.setData({ //计算二维码大小
        qrcodeSize: that.getQRCodeSize()
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载  
   */
  onLoad: function(options) {
    
  },
  tabShow(e) { //翻面
    let index = e.currentTarget.dataset.index; //角标
    let dogCradInfos = this.data.dogCradInfos;
    dogCradInfos[index].showView = !dogCradInfos[index].showView; //切换标记
    this.setData({
      dogCradInfos
    })

  },
  generateEWM(e) { //二维码

  },

  initData() { //查询我的犬证信息
    let _this = this;
   
    wx.request({ //根据犬主id查询电子犬证信息
      url: basicUrl + "/dogCard/selectElectronicDogCard?userId=" + app.globalData.userInfo.userId,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": app.globalData.token
      },
      success(res) {
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
        if (res.data.code == '000000') {
          let datas = res.data.result;
          if (!datas || datas.length <= 0) {
            _this.setData({
              ishasData: false
            })
            return;
          }
          if (datas && datas.length > 0) {
            let temp = [];
            let pattern = "yyyy年MM月dd日"
            for (let i = 0; i < datas.length; i++) {
              temp.push({
                //犬证信息
                dogCardNum: datas[i].dogCardNum, //犬证号
                markNum: datas[i].markNum, //标示号/设备编号
                dogVarieties: datas[i].dogVarieties, //品种
                color: datas[i].color, //毛色
                yearCheckDate: dateFormat(datas[i].yearCheckDate, pattern), //年检时间
                dogUrl: datas[i].dogUrl, //犬图
                //犬主信息
                dogOwnersName: datas[i].dogOwnersName, //犬主姓名
                phone: datas[i].phone, //电话
                address: datas[i].address, //养犬地址
                issuanceUnit: datas[i].issuanceUnit, //签发单位
                startDate: dateFormat(datas[i].startDate, pattern), //初始签发日期
                dogCradStatus: datas[i].dogCradStatus, //犬证状态 0已禁用，1启用/审核通过，2,已过期，3注销，4待审核，5审核不通过
                showView: true, //默认显示正面
                qrcode: { //二维码图片
                  text: datas[i].markNum,
                  // text: datas[i].dogCardNum,
                  // img: _this.createQRCode(datas[i].dogCardNum, _this.data.qrcodeSize),
                  img: _this.createQRCode(datas[i].markNum, _this.data.qrcodeSize),
                }
              })
            }
            _this.setData({
              dogCradInfos: temp
            });
          }
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
    var that = this;
    that.getCard();
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
    this.setData({ //下拉触底，下一页
      MaxCount: this.data.MaxCount * 2
    })
    this.initData(); //刷新列表
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //适配不同屏幕大小的canvas
  getQRCodeSize: function() {
    var size = 0;
    try {
      var res = wx.getSystemInfoSync();
      var scale = res.windowWidth / 750; //不同屏幕下QRcode的适配比例；设计稿是750宽
      var width = 300 * scale;
      size = width;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
      size = 150;
    }
    return size;
  },
  //获取二维码
  createQRCode: function(text, size) {
    //调用插件中的draw方法，绘制二维码图片
    let that = this
    if (!text)
      return;
    try {
      // console.log('QRcode: ', text, size)
      let _img = QR.createQrCodeImg(text, {
        size: parseInt(size)
      })
      return _img;
      // let qrcode = this.data.qrcode;
      // qrcode.qrcode = _img;
      // that.setData({
      //   qrcode
      // })
    } catch (e) {
      console.log(e)
    }
  }

})