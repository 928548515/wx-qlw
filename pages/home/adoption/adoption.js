// pages/appointment/appointment_dog/appointment_dog.js
var info = require("./js/icon.js"); //引入配置文件文件
var request = require("../../../apis/request_sync.js");
var config = require("../../../apis/config.js");
var dateUtiles = require("../../../utils/dateUtils.js");
var dateFormat = require("../../../utils/dateFormat.js");

var app = getApp();


var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dogInfo: {
      name: "小花",
      breed: "柯基",
      sex: 0,
      age: 3,
      color: "花色",
      character: "老实",
      remarks: "",
      url: info.Info.dogInfo
    },
    sexIndex: 0,
    cardTypeIndex: 0,
    adopter: {
      name: "",
      sex: ["男", "女"],
      card_type: ["居民身份证", "护照"],
      card_number: "420624199405895523",
      address: "",
      phone: "",
      identifying_code: "" //验证码
    },
    adoptdog_index: {},

    //获取验证码按钮倒计时
    time: "点击获取",
    currentTime: 61
  },

  /**
   * 判断手机号正则表达式
   */
  checkPhoneNumber: function(e) {
    //获取页面电话
    var phoneNumber = e.detail.value;
    //判断手机号码正则表达式
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    // if (phoneNumber.length == 0){
    //   wx.showToast({
    //     title: '输入手机号为空',
    //     image: "/assets/icon/error.png",
    //     duration: 1500
    //   })
    //   return;
    // } else if (phoneNumber.length != 11){
    //   wx.showToast({
    //     title: '手机号长度有误',
    //     image: "/assets/icon/error.png",
    //     duration: 1500
    //   }) 
    //   return;
    // } else if (!myreg.test(phoneNumber)) {
    //   wx.showToast({
    //     title: '手机号有误',
    //     image: "/assets/icon/error.png",
    //     duration: 1500
    //   })
    //   return;
    // }
    this.setData({
      phoneNumber: phoneNumber
    })
  },




  /**
   * 提交申请
   */
  formSubmit: function(e) {
    const {
      adoptionAddress,
      applyerName,
      applyerPhone,
      applyerSex,
      cardNumber,
      cardType,
      collectionId,
      dogPublicityId,
      operatorId
    } = e.detail.value;

    if (!applyerName || applyerName.trim().length < 2) {
      wx.showToast({
        title: '领养人姓名请正确填写！',
        icon:'none'
      })
      return;
    }
    if (!cardNumber || cardNumber.trim().length == 0){
      wx.showToast({
        title: '证件号码不能为空不正确！',
        icon: 'none'
      })
    }
    if (!cardNumber || cardNumber.trim().length < 5) {
      wx.showToast({
        title: '证件号码填写不正确！',
        icon: 'none'
      })
      return;
    }

    //判断手机号码正则表达式
    const phoneTest = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!phoneTest.test(applyerPhone)) {
      wx.showToast({
        title: '手机号码格式不正确！',
        icon: 'none'
      })
      return;
    }
    wx.showModal({
      title: '领养申请确认？',
      content: '确定要申请领养犬“' + this.data.dogInfo.name+'”吗',
      cancelText:"再看看",
      success: (res)=>{
        if (res.confirm) {
          e.detail.value.dogPublicityId = this.data.adoptdog_index.adoptionPublicityId
          app.globalData.http("/adoption/apply", "POST", e.detail.value)
            .then(res => {
              if (res.data.status == 200) {
                wx.showModal({
                  title: '犬只领养申请',
                  content: '申请领养犬只“' + this.data.dogInfo.name + '”成功!',
                  cancelText: "返回",
                  success: (res) => {
                    if (res.cancel) {
                      //返回
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '网络错误',
                  icon: 'none',
                })
              }
            })
        }
      }
    })

 


    var that = this;
    var adoptApply = e.detail.value;
    //检查验证码是否正确
    var phone = adoptApply.applyerPhone;
    //ip
    var clientIpAddress = that.data.ip;
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },

  bindSexChange: function(e) {
    var that = this;
    that.setData({
      sexIndex: e.detail.value
    })
  },

  bindCardChange: function(e) {
    var that = this;
    that.setData({
      cardTypeIndex: e.detail.value
    })
  },

  /**
   * 获取验证码
   */
  getCode: function() {
    var that = this;
    //检查手机号码是否合法
    var phoneNumber = that.data.phoneNumber;
    if (!phoneNumber || phoneNumber.length <= 0) {
      wx.showToast({
        title: '手机号错误',
        image: "/assets/icon/error.png"
      })
      return;
    }
    wx.request({
      url: 'http://ip-api.com/json',
      success: function(res) {
        //获取客户端ip
        var ip = res.data.query;
        //将ip存入全局变量
        that.setData({
          ip: ip
        })
        var param = {
          clientIpAddress: ip,
          phone: that.data.phoneNumber
        }
        wx.request({
          url: config.SMS_URL + '/SendRandCode',
          data: param,
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "token": app.globalData.token
          },
          method: 'POST',
          success: function(res) {
            if (res.data.status == 200) {
              wx.showToast({
                title: '发送成功',
                icon: "success"
              })
              //设置获取按钮可用
              that.setData({
                disabled: true
              });
              //更改button按钮状态(倒计时)
              var currentTime = that.data.currentTime
              interval = setInterval(function() {
                currentTime--;
                that.setData({
                  time: currentTime + '秒',
                })
                if (currentTime <= 0) {
                  clearInterval(interval);
                  that.setData({
                    time: '重新发送',
                    currentTime: 61,
                    disabled: false
                  })
                }
              }, 100)
            } else {
              wx.showToast({
                title: '发送失败，请稍后再试',
                image: "/assets/icon/error.png"
              })
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var adoptdog_index = JSON.parse(options.adoptdog_index);
    if (adoptdog_index.thumbnailUrl == null) {
      adoptdog_index.thumbnailUrl = info.Info.dogInfo;
    }
    that.setData({
      adoptdog_index: adoptdog_index
    });
    var user = wx.getStorageSync("user");
    //将user存入全局变量
    that.setData({
      user: user
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