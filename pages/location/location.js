// pages/location/location.js
var amapFile = require('../../apis/amap-wx.js'); //如：..­/..­/libs/amap-wx.js
var config = require("../../apis/config.js");
var icon = require("./js/icon.js");
var request = require("../../apis/request.js");
var utils = require("../../apis/util.js");
var dateFormat = require("../../utils/dateFormat.js")

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: true,
    ishasData: true,
    refreshIcon: icon.Icons.refresh,
    myPositionIcon: icon.Icons.myPosition,
    latitude: '', //中心纬度
    longitude: '', //中心经度
    origin: '', //出发点 
    destination: '', //目的地
    distance: '', //距离
    cost: '',
    polyline: [], //折线
    markers:[],
    myPosition:{
      latitude: '', //纬度
      longitude: '', //经度
    },
  },

  //获取目的地位置
  getDestination: function(fun) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    //获取dogRefDevices
    var dogRefDevices = userInfo.dogRefDevices;
    if (!dogRefDevices || dogRefDevices.length <= 0) {
      that.setData({
        ishasData: false,
      })
      return;
    }
    for (var index in dogRefDevices) {
      var dogRefDevice = dogRefDevices[index];
      var deviceId = dogRefDevice.device.deviceId;
      wx.request({
        //查询通知消息
        url: config.BASE_URL + '/path/getDogLocation',
        data: {
          deviceId: deviceId
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": app.globalData.token
        },
        method: 'POST',
        success: (res) => {
          //判断是否过期
          var isexpire = app.isLoginExpire(res);
          if (isexpire) {
            that.setData({
              isLogin: false,
            })
            return;
          }
          //判断是否有值
          if (res.data.data){
            var longitude = res.data.data.longitude;
            var latitude = res.data.data.latitude;
            var deviceId = res.data.data.deviceId;
            var dataTime = res.data.data.dataTime;
            dataTime = dateFormat(dataTime, "yyyy-MM-dd HH:mm");
            for (var index in dogRefDevices) {
              if (dogRefDevices[index].device.deviceId == deviceId) {
                break;
              }
            }
            var destination = longitude + "," + latitude;
            fun(destination, dogRefDevices[index].dogName, dataTime);
          }else{
            fun("","",""); 
          }
        },
      });
    }
  },

  //获取本都数据画线
  buildPath:function(){
    var that = this;
    //获取当前出发点
    utils.getLocation(res => {
      var origin = "";
      if (res && res.longitude) {
        //以当前位置为出发点
        origin = res.longitude + "," + res.latitude;
        that.setData({
          ["myPosition.longitude"]: res.longitude,
          ["myPosition.latitude"]: res.latitude,
        });
        //添加起始点位置
        var markers = [];
        //获取起点显示图标
        var iconPath = icon.Icons.myPositionIcon;
        //创建一个标记点对象
        markers.push({
          longitude: res.longitude,
          latitude: res.latitude,
          iconPath: iconPath,
          width: 40,
          height: 40,
          callout: {
            content: "我的位置",
            fontSize: 12,
            bgColor: "#49C8D5",
            borderRadius: 2,
            display: "ALWAYS",
            textAlign: "center",
            padding: 10
          }
        })
        that.setData({
          markers: markers
        })
      }
      //获取外部传入的目的地
      that.getDestination(function (destination, dogName, dataTime) {
        var destination = destination;
        var dogName = dogName;
        var dataTime = dataTime;
        if (!destination || destination == ""){
            that.setData({
              longitude: that.data.myPosition.longitude,
              latitude: that.data.myPosition.latitude,
            })
            return;
        }
        //获取目的地坐标
        var pointEnd = destination.split(",");
        that.setData({
          longitude: parseFloat(pointEnd[0]),
          latitude: parseFloat(pointEnd[1]),
        })
        //添加终点位置
        var markers = that.data.markers;
        //获取起点显示图标
        var iconPath = icon.Icons.dogIcon;
        //创建一个标记点对象
        markers.push({
          longitude: parseFloat(pointEnd[0]),
          latitude: parseFloat(pointEnd[1]),
          iconPath: iconPath,
          width: 40,
          height: 40,
          callout: {
            content: dogName + "\n" + dataTime ,
            fontSize: 14,
            // bgColor: "#49C8D5",
            borderRadius: 10,
            display: "ALWAYS",
            textAlign: "left",
            padding: 3
          }
        })
        that.setData({
          markers: markers
        })
      });
    });
  },

  getWalkingRoute(origin, destination){
    var key = config.GD_key;
    var amap = new amapFile.AMapWX({
      key: key
    });
    amap.getWalkingRoute({
      /**出发点  格式:<经度(lng),纬度(lat)>*/
      origin: origin,
      /**目的地 */
      destination: destination,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';'); //获取折现坐标点，进行画图
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        //获取折线对象数组
        var polylines = that.data.polyline;
        polylines.push({
          points: points,
          color: "#0091ff",
          width: 6
        })
        //插入折线数据
        that.setData({
          polyline: polylines
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          that.setData({
            cost: parseInt(data.paths[0].duration / 60) + '分钟'
          });
        }
      },
      fail: function (res) {

      },
      complete: function (res) {
      },
    })
  },

  getlocation:function(){
    var that =this;
    //从全局变量中获取
    var userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo == "") {
      that.setData({
        isLogin: false,
      })
      return;
    }
    //获取dogRefDevices
    var dogRefDevices = userInfo.dogRefDevices;
    //如果未获取到目的地数据
    if (!dogRefDevices || dogRefDevices.length <= 0) {
      that.setData({
        ishasData: false,
      })
      return;
    }
    that.buildPath();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  refreshPath:function(){
    var that = this;
    that.buildPath();
  },

  myPosition:function(){
    var that = this;
    var myPosition = that.data.myPosition;
    that.setData({
      longitude: myPosition.longitude,
      latitude: myPosition.latitude
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
    this.setData({ markers: [] })
    var that = this;
    that.getlocation();
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