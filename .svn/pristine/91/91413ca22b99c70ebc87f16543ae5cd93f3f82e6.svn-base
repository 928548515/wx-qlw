var amapFile = require('amap-wx.js'); //如：..­/..­/libs/amap-wx.js
var config = require("config.js");

//获取当前位置
function getLocation(resolve) {
  wx.getLocation({
    type: "gcj02",
    success: resolve,
    fail: () => {
      wx.getSetting({
        success: function(res) {
          var statu = res.authSetting;
          if (!statu['scope.userLocation']) {
            wx.showModal({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
              success: function(tip) {
                if (tip.confirm) {
                  wx.openSetting({
                    success: function(data) {
                      console.log("success")
                      if (data.authSetting["scope.userLocation"] === true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        //授权成功
                        getLocation(resolve)
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'success',
                          duration: 1000
                        })
                      }
                    }, fail: (res) => {
                      console.log(res);
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  })
  // let promise = new Promise((resolve, reject) => wx.getLocation({
  //   type: "gcj02",
  //   success: resolve,
  //   fail: openSetting
  // }))
  // return promise;
}

function test() {
  wx.getSetting({
    success: function(res) {
      var statu = res.authSetting;
      if (!statu['scope.userLocation']) {
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
          success: function(tip) {
            if (tip.confirm) {
              wx.openSetting({
                success: function(data) {
                  if (data.authSetting["scope.userLocation"] === true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    //授权成功之

                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'success',
                      duration: 1000
                    })
                  }
                }, fail: (res) => {
                  console.log(res);
                  debugger
                  if (!res.authSetting['scope.userLocation']) {
                    showRemind();
                  }
                }
              })
            }
          }
        })
      }
    }
  })
}

function openSetting() {
  wx.openSetting({
    success: (res) => {
      if (!res.authSetting['scope.userLocation']) {
        showRemind();
      }
    },
    fail: (res) => {
      console.log(res);
      if (!res.authSetting['scope.userLocation']) {
        showRemind();
      }
    }
  })
}

function showRemind() {
  wx.showModal({
    title: '温馨提醒',
    content: '需要获取您的地理位置才能使用小程序',
    showCancel: false,
    confirmText: '获取位置',
    success: function(res) {
      if (res.confirm) {
        getLocation();
      }
    },
    fail: (res) => {}
  })
}


//获取路线规划
function getWalkingRoute(origin, destination) {

  var key = config.GD_key;
  console.log(key);
  console.log(origin);
  console.log(destination);
  var amap = new amapFile.AMapWX({
    key: key
  });
  return new Promise((resolve, reject) => amap.getWalkingRoute({
    success: resolve,
    fail: reject
  }))
}

function test() {
  return new Promise((resolve, reject) => wx.getLocation({
    success: resolve,
    fail: reject
  }))
}


module.exports = {
  getLocation: getLocation,
  getWalkingRoute: getWalkingRoute,
  test: test
}