// pages/my/page/dog_route/route/route.js
var amapFile = require('../../../../../apis/amap-wx.js'); //如：..­/..­/libs/amap-wx.js
var config = require("../../../../../apis/config.js");
var request = require("../../../../../apis/request.js");
var utils = require("../../../../../apis/util.js");
var icon = require("../../../../location/js/icon.js");
var dateFormat = require("../../../../../utils/dateFormat.js")
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '22.55329', //中心纬度
    longitude: '113.88308', //中心经度
    origin: '', //出发点 
    destination: '', //目的地
    distance: 0, //距离
    markers: [], //标记点(起始)
    cost: 0, //花费时间
    polyline: [], //折线
    date: "2018-09-6",
    url: "/assets/icon/log.png",
    searchdate: "2018-09-6",
    endData: "",
    startData: "2000-01-01",
  },

  getPath: function(deviceId, date) {
    const that = this;
    app.globalData.http("/path/getPath", "POST", {
      deviceId: deviceId,
      date: date,
      startTime: "00:00",
      endTime: "23:59"
    }).then(res => {
      //获取当前对象设备数据
      var deviceDatas = res.data.data;
      if (deviceDatas == null || deviceDatas.length <= 0) {
        wx.showToast({
          title: '当天无数据',
          //  image: '/assets/icon/nodata.png',
          icon:'none',
          duration: 1500,
          mask: true,
        })
        return;
      }

      //第一条数据作为起点，添加remark
      var firstData = deviceDatas[0];
      //添加markers
      var markers = that.data.markers;
      //获取起点显示图标
      var iconPathStart = icon.Icons.StartIcon;
      markers.push({
        longitude: firstData.longitude,
        latitude: firstData.latitude,
        iconPath: iconPathStart,
        width: 30,
        height: 40,
      });

      //获取最后一条数据为终点，添加remark
      var lastData = deviceDatas[deviceDatas.length - 1];
      //获取起点显示图标
      var iconPathEnd = icon.Icons.EndIcon;
      const distance = this.data.distance;
      let len = distance > 1 ? distance + " km" : (1000 * distance).toFixed(1) + " m";
      const cost = this.data.cost;
      let hLen = cost > 1 ? cost + " h" : (60 * cost).toFixed(1) + " min";
      markers.push({
        longitude: lastData.longitude,
        latitude: lastData.latitude,
        iconPath: iconPathEnd,
        width: 30,
        height: 40,
        callout: { //创建标记点上方气泡
          content: "活动距离：" + len + "\n活动时长：" + hLen,
          display: "ALWAYS",
          textAlign: "left",
          borderRadius: 1,
          color: "#27408B",
          borderColor: "#8B7B8B",
          borderWidth: 1,
          padding: 5
        }
      })
      //将终点坐标定为中心经纬度
      that.setData({
        longitude: lastData.longitude,
        latitude: lastData.latitude,
      })
      var points = [];
      for (var i = 0; i < deviceDatas.length; i++) {
        var deviceData = deviceDatas[i];
        //添加折线顶点
        points.push({
          longitude: deviceData.longitude,
          latitude: deviceData.latitude
        })
        //添加折线顶点标记
        //添加markers
        var markers = that.data.markers;
        var spotIcon = icon.Icons.spotIcon;
        let marker = {
          longitude: deviceData.longitude,
          latitude: deviceData.latitude,
          iconPath: spotIcon,
          width: 20,
          height: 20,
          anchor: {
            x: 0.5,
            y: 0.5
          }
        }
        //最后一个和第一次去除 添加气泡
        if (i > 0 && i < deviceDatas.length - 1) {
          // marker.callout = {
          //   content: "距离上个点：" + that.data.distance + "km\n时长：" + that.data.cost + "h",
          //   display: "BYCLICK",
          //   textAlign: "center",
          //   color: "#25A65F",
          //   borderColor: "#cccccc",
          //   borderWidth: 1,
          //   padding: 1
          // }
        }
        this.data.markers.push(marker);
      }
      that.setData({
        markers: markers
      })
      //插入折线数据
      that.setData({
        polyline: [{
          points: points,
          color: "#4DDC26",
          width: 5,
          arrowLine: true
        }]
      });
    });

  },

  path: function() {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo == "") {
      wx.navigateTo({
        url: '/pages/login/login',
      })

      return;
    } else {
      that.getDate();
      var dog_index = that.data.dog;
      //暂定
      var deviceId = dog_index.deviceId;
      //获取当前时间
      var date = dateFormat(new Date(), "yyyy-MM-dd");
      that.setData({
        deviceId: deviceId,
        searchdate: date
      })
      //获取犬只当天的活动时间和活动里程
      that.getDistanceAndTime(deviceId, date);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var dog_index = JSON.parse(options.dog_index);
    that.setData({
      dog: dog_index
    })

  },


  /**
   * 获取犬只当天的活动时间和活动里程
   */
  getDistanceAndTime: function(deviceId, date) {
    var that = this;
    wx.request({
      url: config.BASE_URL + '/path/getDistanceAndTime',
      data: {
        deviceId: deviceId,
        date: date,
        startTime: "00:00",
        endTime: "23:59"
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": app.globalData.token
      },
      method: 'POST',
      success: function(res) {
        //判断是否过期
        var isexpire = app.isLoginExpire(res);
        if (isexpire) {
          setTimeout(function() {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }, 1500)
          return;
        }
        var distanceAndTime = res.data.data;
        if (distanceAndTime) {
          that.setData({
            distance: distanceAndTime.distance, //距离
            cost: distanceAndTime.time, //花费时间
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        //查轨迹
        that.getPath(deviceId, date)
      },
    })

  },


  /**日期change事件 */
  bindDataChange: function(e) {
    var that = this;
    that.setData({
      searchdate: e.detail.value
    });
  },

  querytrail() {
    var that = this;
    //清空原来缓存数据
    that.setData({
      distance: 0, //距离
      markers: [], //标记点(起始)
      cost: 0, //花费时间
      polyline: [], //折线
    })

    //获取device数据
    var deviceId = that.data.deviceId;
    var date = that.data.searchdate;

    that.getDistanceAndTime(deviceId, date);
  },

  /**获取当前时间 */
  getDate: function() {
    var nowData = dateFormat(new Date(), "yyyy-MM-dd");
    this.setData({
      endData: nowData,
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
    var deviceId = that.data.deviceId;
    var date = that.data.searchdate;
    that.path(deviceId, date);
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