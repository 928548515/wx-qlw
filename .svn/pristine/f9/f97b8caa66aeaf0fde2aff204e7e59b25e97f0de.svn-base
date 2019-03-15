// pages/my/page/myData/resetPwd/resetPwd.js
const app = getApp();
const http = app.globalData.http;
const {
  $Message
} = require("../../../../../components/dist/base/index")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    newPassword: '',
    newConfirmPassword: '',
  },
  pwdChange(e) {
    this.setData({
      password: e.detail.value
    })
  },
  newPwdChange(e) {
    this.setData({
      newPassword: e.detail.value
    })
  },
  newPwdConfirmChange(e) {
    this.setData({
      newConfirmPassword: e.detail.value
    })
  },
  toback() {
    wx.navigateBack({
      delta: 1
    })
  },
  reset() {
    this.setData({
      password: '',
      newPassword: '',
      newConfirmPassword: '',
    })
  },
  submit() {
    const {
      password,
      newPassword,
      newConfirmPassword
    } = this.data;

    if (!password || password.trim().length == 0) {
      $Message({
        content: '原密码不能为空！',
        type: 'warning'
      });
      return;
    }
    if (password.trim().length < 6) {
      $Message({
        content: '原密码长度不够！',
        type: 'warning'
      });
      return;
    }
    if (!newPassword || newPassword.trim().length == 0) {
      $Message({
        content: '新密码不能为空！',
        type: 'warning'
      });
      return;
    }
    if (newPassword.trim().length < 6) {
      $Message({
        content: '新密码长度不够！',
        type: 'warning'
      });
      return;
    }

    if (newPassword != newConfirmPassword) {
      $Message({
        content: '两次密码输入不一致！',
        type: 'warning'
      });
      return;
    }

    if (password == newConfirmPassword) {
      $Message({
        content: '原密码和新密码相同！',
        type: 'warning'
      });
      return;
    }

    wx.showModal({
      title: '密码修改确认 ?',
      content: '您密码将被永久修改,请牢记！',
      cancelColor: "#3cc51f",
      confirmText: "确认修改",
      confirmColor: "#FD9325",
      success: (res) => {
        if (res.confirm) {
          http("/user/updatePwd", "post", {
            userId: app.globalData.userInfo.userId,
            oldPwd: password,
            newPwd: newPassword
          }).then(res => {
            if (res.data.status == 200) {
              $Message({
                content: "修改成功",
                type: 'success'
              });
              this.logout();
              wx.showModal({
                title: '密码修改成功',
                content: '密码修改成功,是否去重新登录？',
                confirmText: "去登陆",
                cancelText: "去首页",
                success: (res) => {
                  let url = "/pages/index/index";
                  if (res.confirm) {
                    url = "/pages/login/login";
                  }
                  wx.reLaunch({url})
                }
              })

            } else {
              $Message({
                content: res.data.msg,
                type: 'warning'
              });
            }
          })
        }
      }
    })

  },

  //退出登录
  logout() {
    http("/logout").then(res => {
        wx.clearStorageSync();
        app.globalData.userInfo = {};
      })
      .catch(res => {
        wx.showToast({
          title: '登出失败！',
          icon: 'none'
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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