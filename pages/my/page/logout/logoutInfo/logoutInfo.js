// pages/my/page/logout/logout.js
const app = getApp();
const basicUrl = app.globalData.basicUrl;
let userInfo = wx.getStorageSync("user");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoutRs: {
      logoutReason: [], //注销原因
      logoutReasonIndex: 0, //选择的项
    },
    clientIpAddress: '', //用户ip地址
    dogId: '', //犬只id


  },
  bindPickerChange(e) { //选择注销原因
    let curIndex = e.detail.value;
    if (curIndex) {
      this.setData({
        logoutRs: {
          logoutReason: this.data.logoutRs.logoutReason,
          logoutReasonIndex: curIndex
        }
      });
    }
  },
  getYxmPic(e) { //获取验证码
    wx.request({
      url: 'http://ip-api.com/json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": app.globalData.token
      },
      success: function(e) {
        let phone = userInfo.phone;
        if (!phone) {
          wx.showToast({
            'title': '网络开小差了!',
            'icon': 'icon'
          })
          return;
        }
        let clientIpAddress = e.data.query; //ip地址
        this.setData({
          clientIpAddress
        })
        wx.request({ //发送验证码请求
          url: basicUrl + '/SendRandCode',
          header: {
            'Content-Type': 'application/json; charset=utf-8',
            "token": app.globalData.token
          },
          data: {
            clientIpAddress,
            phone,
          },
        })
      }
    })
  },
  reset(e) { //取消按钮
    wx.navigateBack({
      delta: 1
    })
  },
  mathPic(e) { //失去焦点比对验证码
    let yzm = e.detail.value;
    let _this = this;
    if (!this.comparPic(yzm)) { //验证码没有填写校验
      return;
    }
    wx.request({
      url: basicUrl + '/CheckRandCode',
      data: {
        clientIpAddress: _this.clientIpAddress,
        phone: userInfo.phone,
        randCode: yzm
      },
      header: {
        'Content-Type': 'application/json; charset=utf-8',
        "token": app.globalData.token
      },
      success(res) {
        if (!'200' == res.data.status) {
          wx.showToast({
            title: '验证码不正确！',
            icon: 'none'
          })
        }
      }
    })

  },
  comparPic(yzmPic) { //比对验证码
    if (!yzmPic) { //验证码不对禁止提交
      wx.showToast({
        title: '验证码请填写！',
        icon: 'none'
      })
      return false;
    }
    return true;
  },
  formSubmit(e) { //提交按钮
    let yzmPic = this.data.yzmPic; //验证码
    // if (!this.comparPic(yzmPic)) { //验证码为空禁止提交
    //   return;
    // }

    let cancellation = this.data.logoutRs.logoutReason[this.data.logoutRs.logoutReasonIndex]; //取消原因
    let cancellationNote = e.detail.value.inner; //备注
    let dogId = this.data.dogId;

    wx.showToast({
      title: '功能暂未开通',
      icon:'none'
    })
    return;
    app.globalData.http("/dogAndOwner/cancellationDog", "get", {
      cancellation,
      dogId,
      cancellationNote, //备注
    },null,"正在提交...").then(res=>{
      if (res.data.code == '000000') {
        wx.showToast({
          title: '提交成功!',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: '提交失败!',
          icon: 'none'
        })
      }

    })
  },

  getlogouts: function (options){
    var that = this;
    var userInfo = app.getUserInfo();
    if (!userInfo || userInfo == "") {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }else{
      let dogId = options.dogId;
      if (!dogId) { //需要犬id 没有犬id调回上一页
        wx.navigateBack({
          delta: 1
        })
        return;
      }
      this.setData({
        dogId
      }); //页面传过来的dogid
      const _this = this;
      wx.request({ //所有注销原因
        url: basicUrl + '/dogAndOwner/logouts',
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
          if (res.data.meta.success) {
            let logoutReason = [];
            res.data.data.map((item, index) => { //所有注销的原因
              logoutReason.push(item.dictionaryDescribe);
            })
            _this.setData({
              logoutRs: {
                logoutReason, //注销原因
                logoutReasonIndex: 0, //选择的项
              }
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getlogouts(options);
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