// pages/login/login.js
var config = require("../../apis/config.js"); //引入配置文件文件

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: {
      title_url: "/assets/title/login.png",
      username: "",
      password: "",
      username_icon: "/assets/icon/username.png",
      password_icon: "/assets/icon/password.png"
    }
  },
  toIndex(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 提交到后台
   */
  formSubmit: function(e) {
    var formdata = e.detail.value;
    //用户名校验
    if (!formdata.username || formdata.username.trim().length == 0) {
      wx.showToast({
        "title": "用户名不能为空",
        "icon": "none"
      });
      return
    }
    //密码校验
    if (!formdata.password || formdata.password.trim().length == 0) {
      wx.showToast({
        "title": "密码不能为空",
        "icon": "none"
      });
      return
    }
    //去除(用户名,密码)空格
    var username = formdata.username.replace(/\s+/g, '')
    var password = formdata.password.replace(/\s+/g, '')
    var data = {
      username: username,
      password: password,
    }
    wx.showLoading({
      title: '正在登录,请稍候...',
    })
    wx.request({
      url: config.BASE_URL + "/login",
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": app.globalData.token
      },
      method: 'POST',
      success: function(res) {
        //添加token
        var token = res.header.token;
        wx.setStorageSync("token", token);
        app.globalData.token = token;
        /**如果返回值状态为200 跳转到首页 */
        if (res.data.status == 200) {
          try {
            /**获取user */
            var userInfo = res.data.data;
            var roles = userInfo.tRoles;
            var isOwner = false;
            for (var index in roles) {
              var role = roles[index];
              //判断当前用户是否是犬主
              if (role.roleId == 3) {
                isOwner = true;
              }
            }
            //如果不是犬主，调用登出
            if (!isOwner) {
              wx.request({
                url: config.BASE_URL + "/logout",
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  "token": app.globalData.token
                },
                method: 'GET',
                dataType: 'json',
                success: function(res) {

                },
              })
              wx.showModal({
                title: '错误',
                content: '您不是犬主',
                showCancel: false
              })
              return;
            }
            //设置
            app.globalData.isShowTosal = false;
            //用户信息app里面保存一份
            app.globalData.userInfo = userInfo;
            //将user信息存入本地内存
            wx.setStorage({
              key: 'userInfo',
              data: userInfo,
            })
            //获取上一页
            // var pages = getCurrentPages();
            // console.log(pages);
            // var lastPage = pages[pages.length - 2];
            // console.log(lastPage)
            // var route = "/"+lastPage.route;

            // wx.reLaunch({
            //   url: route
            // })
            //返回主页
            wx.reLaunch({
              url: '/pages/index/index',
            })
          } catch (e) {
            wx.showToast({
              title: '登录失败！',
              icon: 'none'
            })
          }

        } else {
          wx.showModal({
            title: '错误',
            content: '账号或密码错误！！',
            showCancel: false
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading();
      },
    })
  },

  formReset: function() {
    console.log('form发生了reset事件')
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