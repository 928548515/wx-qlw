// pages/my/page/appointment/appointment-info/appointment-info.js
var dateUtils = require("../../../../../utils/dateUtils.js");
var dateFormat = require("../../../../../utils/dateFormat.js");
let initDate = new Date();
var app = getApp();
const basicUrl = app.globalData.basicUrl;
const {asynHttp:http} = require("../../../../../apis/request_sync.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择的时间
    selectTime: {
      select_date: dateFormat(initDate, 'yyyy-MM-dd'),
      select_time: dateFormat(initDate, 'HH:mm'),
    },
    selectText: { //待选文本框内容
      select_date: '请选择日期',
      select_time: '请选择时间',
    },
    curData: dateFormat(initDate, 'yyyy-MM-dd'),
    curTime: dateFormat(initDate, 'HH:mm'),
    //业务员类型
    bizListIndex: 0,
    bizList: [], //预约业务类型
    //网点
    bizServerIndex: 0,
    bizServerList: ['a', 'aa'],//网点信息
    message: '', //错误提示
  },
  bindDateChange(e) { //选择时间
    this.setData({
      selectTime: {
        select_date: e.detail.value,
        select_time: this.data.selectTime.select_time
      },
      selectText: {
        select_date: e.detail.value,
        select_time: this.data.selectText.select_time
      },
    })
  },
  bindTimeChange(e) { //选择日期
    this.setData({
      selectTime: {
        select_time: e.detail.value,
        select_date: this.data.selectTime.select_date
      },
      selectText: {
        select_time: e.detail.value,
        select_date: this.data.selectText.select_date
      },
    })
  },
  //网点选择
  bindBizserverChange(e) {
    this.setData({
      bizServerIndex: e.detail.value
    })
  },
  //业务类型选择
  bindBizChange(e) {
    this.setData({
      bizListIndex: e.detail.value
    })
  },
  formSubmit(e) { //提交按钮
    let forData = e.detail.value;
    if (forData) {
      let selectDate = forData.date; //预约时间
      let selectTime = forData.time; //预约时间
      let bizType = forData.bizType;
      let appointmentName = forData.uname;
      let appointmentPhone = forData.phone;
      let orgId = this.data.bizServerList.organizationId || this.data.bizServerList.orgId;//网点id
 
      this.testPhone(appointmentPhone);

      if (!this.data.message) { //没有提示消息
        // let param = '?bizType=' 
        wx.request({//新增预约信息
          url: basicUrl + '/reservation',
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "token": app.globalData.token
          },
          data: {
            bizType,
            appointmentName,
            appointmentPhone,
            appointmentChannel: 1,
            scheduleTime: selectDate + ' ' + selectTime + ':00',
            orgId,
            userId: 101213
          },
          success(res) {
            let str = "预约失败！"
            if (res.data.meta.success) {
              // wx.showToast({
              //   title: 'success!',
              //   icon: 'success'
              // })
              str = "预约成功";
            } else {
              // wx.showToast({
              //   title: 'err!',
              //   icon: 'none'
              // })
            }
            wx.showModal({
              title: '业务预约',
              content: str,
              cancelText: "返回",
              confirmText: "继续办理",
              success: (res) => {
                if (res.confirm) {
                }
                if (res.cancel) {//返回
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          
          }
        })
      }
    }
  },

  regPhone(e) { //手机号码输入校验
    let phone = e.detail.value;
    this.testPhone(phone);
  },
  testPhone(phone) { //校验手机号
    let regexp = new RegExp('^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$'); //电话正则
    let message = '';
    if (regexp.test(phone)) {
      message = '';
    } else {
      message = '手机号码格式不正确！';
    }
    this.setData({
      message
    })
  },
  formReset(e) { //重置按钮
    this.setData({
      message: ''
    });
    wx.navigateBack({
      delta: 1
    }); //跳回
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let appointment = options.item;
    if (!appointment){//没有网点信息退回上一页
      wx.navigateBack({
        delta:1
      })
      return;
    }
    this.setData({ bizServerList: JSON.parse(appointment)})
    //需要网点信息
    let _this = this;
    wx.request({ //查询所有业务类型
      url: basicUrl + '/reservation/type',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": app.globalData.token
      },
      success(res) {
        if (res.data.meta.success) {
          let bizList = []; //业务类型
          res.data.data.map((item, index) => {
            bizList.push(item.dictionaryDescribe);
          });
          _this.setData({
            bizList
          });
        }
      }
    });

    //获取本地位置信息
    wx.getLocation({
      success: function(res) {
        //位置信息
        let param = "?ALon=" + res.longitude + "&ALat=" + res.latitude;
        wx.request({ //查询所有网点查询  根据距离
          url: basicUrl + '/serviceSite/getNearbyServiceSites' + param,
          method: "post",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "token": app.globalData.token
          },
          success(res) {
            if (res.statusCode == 200) {
              let datas = res.data.data;
              if (datas && datas.length > 0) {
                datas.map((item, index) => { //将医院名称添加到集合中
                  // _this.data.bizServerList.push(item.organizationName);
                });
              }
            }
          }
        });

      },
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

  },

})