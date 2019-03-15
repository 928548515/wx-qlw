 //引入配置文件文件
 var request = require("../../../../apis/request_sync.js");
 var config = require("../../../../apis/config.js");
 var dateUtiles = require("../../../../utils/dateUtils.js");
 var dateFormat = require("../../../../utils/dateFormat.js");
 // var icon = require("./js/icon.js");

 const app = getApp();
 Page({
   /**
    * 页面的初始数据
    */
   data: {
     mapAnimation: { //地图动画
       data: '',
       fullMax: false, //地图是否最大化
     },
     ishasData: true,
     origin: '', //出发点 
     postion: {
       longitude: 0,
       latitude: 0,
     },
     destination: '', //目的地
     distance: '', //距离
     markers: [], //标记点(起始)
     cost: '', //花费时间
     polyline: [], //折线
     url: "/assets/icon/日志.png",
     listInfo: [], //列表信息
     param: {
       pageNum: 1,
       pageSize: 4,
       totalCount: -1,
       orgtype: 2
     }
   },
   //地图动画
   fullMap() {
     let animation = wx.createAnimation({
       transformOrigin: "50% 50%",
       duration: 800,
       timingFunction: "ease",
       delay: 0
     })
     let heightVal = "500rpx"
     if (!this.data.mapAnimation.fullMax) {
       heightVal = "95vh";
     }
     animation.height(heightVal).step();
     this.data.mapAnimation.data = animation.export();
     this.data.mapAnimation.fullMax = !this.data.mapAnimation.fullMax;
     this.setData({
       mapAnimation: this.data.mapAnimation
     })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     var that = this;
     wx.getLocation({
       type: 'gcj02',
       success: function(res) {
         //添加本地经纬度
         that.data.postion.longitude = res.longitude
         that.data.postion.latitude = res.latitude
         //  that.data.postion.longitude = "113.9084655046"
         //  that.data.postion.latitude = "22.5767718898"
         that.setData({
           postion: that.data.postion
         })
       },
       fail: function(res) {},
       complete: function(res) {
         that.initData()
         that.initMapData()
       },
     })

   },
   //添加我的位置
   pushMyMaker() {
     let marker = this.createMarker(this.data.postion.latitude, this.data.postion.longitude, 0, "我的位置", "/assets/page/my/appoitment/myLocation-icon2.png");
     this.data.markers.unshift(marker)
     this.setData({
       markers: this.data.markers
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
   onShow: function() {},

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
   onPullDownRefresh: function() {},

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {
     if (this.data.listInfo.length < this.data.param.totalCount) {
       this.data.param.pageNum = this.data.param.pageNum + 1;
       this.setData({
         param: this.data.param
       })
       this.initData(true);
     }
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   },
   toDetail(e) {
     let item = e.currentTarget.dataset.item
     wx.navigateTo({
       url: '/pages/my/page/appointment/service-detail/service-detail?id=' + item.orgId,
     })

   },
   //跳到预约详情页
   toAppointmentInfo(e) {
     let temp = e.currentTarget.dataset.appointment
     wx.navigateTo({
       url: './appointment-info/appointment-info?item=' + JSON.stringify(e.currentTarget.dataset.appointment),
     })
   },
   initMapData(size = 200) {
     let param = {
       pageNum: 1,
       orgtype: this.data.param.orgtype,
       pageSize: size,
     }
     if (this.data.postion) {
       param.lng = this.data.postion.longitude;
       param.lat = this.data.postion.latitude;
     }
     param.pageSize = size; //查看附件的200个网点
     app.globalData.http("/serviceSite/getServiceSitesPage", "post", param)
       .then(res => {
         if (res.data.status == 200) {
           let list = res.data.data.list;
           let markers = list.map((x, i) => {
             let icon = x.power == 0 ? "/assets/icon/remark_blue.png" : "/assets/icon/remark_red.png";
             let distance = x.distance ? "\n距我约 " + x.distance / 1000 + " km" : "";
             let markerText = `${x.organizationName} \n${x.fixedPhone ? x.fixedPhone : x.phone} ${distance}`;
             return this.createMarker(x.latitude, x.longitude, x.organizationId, markerText, icon)
           });
           this.pushMyMaker() //添加我的位置
           this.setData({
             markers: markers
           })
         }
       })
   },
   //初始化数据列表
   initData(isAppend = false) {
     let param = this.data.param;
     if (this.data.postion) {
       param.lng = this.data.postion.longitude;
       param.lat = this.data.postion.latitude;
     }
     app.globalData.http("/serviceSite/getServiceSitesPage", "post", param)
       .then(res => {
         if (res.data.status == 200) {
           let list = res.data.data.list;
           //  let markers = [];
           list = list.map((x, i) => {
             //  let icon = x.power == 0 ? "/assets/icon/remark_blue.png" : "/assets/icon/remark_red.png";
             //  let distance = x.distance ? "\n距我约 " + x.distance / 1000 + " km" : "";
             //  let markerText = `${x.organizationName} \n${x.fixedPhone ? x.fixedPhone : x.phone} ${distance}`;
             //  markers.push(this.createMarker(x.latitude, x.longitude, x.organizationId, markerText, icon));
             return {
               organizationName: x.organizationName,
               phone: x.phone,
               distance: x.distance,
               pictureUrl: x.pictureUrl[0],
               address: x.address,
               orgId: x.organizationId,
               pictureUrl: x.pictureUrl,
               fixedPhone: x.fixedPhone
             }
           });
           this.data.param.totalCount = res.data.data.total;
           if (isAppend) {
             list = this.data.listInfo.concat(list);
             //  markers = this.data.markers.concat(markers);
           } else {
             //  this.pushMyMaker(); //添加我的位置
           }

           this.setData({
             listInfo: list,
             param: this.data.param,
             //  markers: markers
           })
         }
       })
   },
   createMarker(latitude, longitude, id = "0", markerText = "markerText", icon) {
     let display = id == 0 ? "ALWAYS" : "BYCLICK";
     //创建标记点上方气泡
     let callout = {
       content: markerText,
       display: display,
       textAlign: "center",
       color: "#27408B",//"#25A65F",
       borderColor: "#cccccc",
       borderWidth: 1,
       padding: 2
     };
     //  icon = icon == 0 ? "/assets/icon/remark_blue.png" : "/assets/icon/remark_red.png";
     //  //创建标记点
     return {
       id: id,
       latitude: latitude,
       longitude: longitude,
       iconPath: icon,
       width: 32,
       height: 32,
       title: markerText,
       callout
     }
   },



 })