/**
 * name: api.js
 * description: request处理基础类
 * author: 彭雨
 * date: 2018-5-19
 */
var config = require("config.js"); //引入配置文件文件

function Get(url, params) {
  wx.showNavigationBarLoading(); //顶部显示londing效果
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.BASE_URL + url,
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded" //跨域请求
      },
      method: 'GET',
      dataType: 'json',
      success: res => {
        resolve(res.data);
        wx.hideNavigationBarLoading(); //顶部隐藏loading效果 
      },
      fail: (err) => {
        reject(err.data);
        wx.hideNavigationBarLoading();
      }
    })
  })

};

function Post(url, params) {
  wx.showNavigationBarLoading(); //顶部显示londing效果
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.BASE_URL + url,
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded" //跨域请求
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        resolve(res.data);
        wx.hideNavigationBarLoading(); //顶部隐藏loading效果 
      },
      fail: (err) => {
        resolve(err.data);
        console.log("post 请求:" + config.BASE_URL);
        console.log(err);
      }
    });
  })
};

function asynHttp(url, method, params, header, loadingText) {
  wx.showNavigationBarLoading(); //顶部显示londing效果

  const app = getApp();

  const curUrl = config.BASE_URL + url;
  const curMethod = method || "GET";
  const data = params || {};
  const curHeader = header || { "Content-Type":"application/x-www-form-urlencoded;charset=utf-8"};
  curHeader["token"] = app.globalData.token;

  if (loadingText && loadingText.trim().length > 0) {
    wx.showLoading({
      title: loadingText,
    })
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: curUrl,
      data,
      header: curHeader,
      method: curMethod,
      dataType: 'json',
      success: (res) => {
        //登录检查
        if (app.isLoginExpire(res)) {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }, 1500)
          return;
        }
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
      complete() {
        wx.hideNavigationBarLoading(); //顶部隐藏loading效果 

        if (loadingText && loadingText.trim().length > 0) {
          wx.hideLoading();
        }
      }
    });
  })
}


//暴露接口
module.exports = {
  httpGet: Get,
  httpPost: Post,
  asynHttp: asynHttp
}