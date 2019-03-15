//index.js
var icon = require("./js/icon.js"); //引入配置文件文件
var request = require("../../apis/request_sync.js");
var config = require("../../apis/config.js");
var dateUtiles = require("../../utils/dateUtils.js");
var dateFormat = require("../../utils/dateFormat.js");

//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    icons: {
      addressIcon: icon.Icons.addressIcon,
      phoneIcon: icon.Icons.phoneIcon,
      appointmentIcon: icon.Icons.appointmentIcon, //预约
      ServiceInformationIcon: icon.Icons.ServiceInformationIcon, //服务指南
      PoliciesAndRegulatIcon: icon.Icons.PoliciesAndRegulatIcon, //政策法规
      DynamicInformationIcon: icon.Icons.DynamicInformationIcon, //动态资讯
      KnowledgeOfDogBreedingIcon: icon.Icons.KnowledgeOfDogBreedingIcon //养犬知识
    },
    titles: {
      adopt_title: icon.Titles.adopt_title,
      serviceSite_title: icon.Titles.serviceSite_title,
      forbid_title: icon.Titles.forbid_title
    },
    imgUrls: icon.Slides,
    Informations: [{
        imgurl: icon.Icons.PoliciesAndRegulatIcon,
        text: "政策法规",
        Info_type: 0
      }, {
        imgurl: icon.Icons.DynamicInformationIcon,
        text: "动态资讯",
        Info_type: 1
      }, {
        imgurl: icon.Icons.KnowledgeOfDogBreedingIcon,
        text: "养犬知识",
        Info_type: 2
      }, {
        imgurl: icon.Icons.ServiceInformationIcon,
        text: "服务指南",
        Info_type: 3
      }
    ],
    adoptcounts: [1, 2],
    adoptItems: [],
    serviceSites: [],

    indicatorDots: true,
    autoplay: true,
    intervar: 5000,
    duration: 1000,
    forbiddog: [],
    counts: [],
    ishasAdoptdogs: true,
    ishasServiceSites: true,
    isforbidDog: true,

    forbid_dogs: [],

  },
  noneBiz() {
    wx.showToast({
      title: '功能暂未开通',
      icon: 'none'
    })
  },
  //禁养详情页
  tobanDetail(e) {
    wx.navigateTo({
      url: "/pages/home/noPetDetail/noPetDetail?item=" + JSON.stringify(e.currentTarget.dataset.item)
    })
  },

  /**
   * 获取服务网点
   */
  getServiceSite() {
    var that = this;
    let position = {};
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        //添加本地经纬度
        position.longitude = res.longitude
        position.latitude = res.latitude
      },
      complete: () => {
        let params = {
          pageNum: 1,
          pageSize: 3,
          orgtype: 2
        }
        if (position) {
          params.lng = position.longitude;
          params.lat = position.latitude;
        }
        app.globalData.http("/serviceSite/getServiceSitesPage", "post", params)
          .then(res => {
            var serviceSites = res.data.data.list;
            if (!serviceSites || serviceSites.length <= 0) {
              that.setData({
                ishasServiceSites: false,
              })
              return;
            }
            if (serviceSites && serviceSites != '') {
              for (var i = 0; i < serviceSites.length; i++) {
                //获取服务网点图片
                if (serviceSites[i].pictureUrl && serviceSites[i].pictureUrl.length > 0) {
                  serviceSites[i].imgUrl = serviceSites[i].pictureUrl[0].thumbnailUrl;
                } else {
                  serviceSites[i].imgUrl = "/assets/pethospital/serviceSite.png";
                }
                var temp = dateFormat(serviceSites[i].creationTime, 'yyyy-MM-dd');
                serviceSites[i].creationTime = temp;
              }
            }
            that.setData({
              serviceSites: serviceSites,
            })
          })

      }
    })
  },




  /**
   * 获取禁养品种
   */
  getforbid_dog: function() {
    app.globalData.http("/ban/findAll", "get", {
      pn: 1,
      pageSize: 100
    }).then(res => {
      if (res.data.status == 200) {
        if (!res.data.data.lists || res.data.data.lists.length == 0) {
          this.setData({
            isforbidDog: false
          })
          return;
        }
        const list = res.data.data.lists;
        this.setData({
          forbid_dogs: list
        });
        //获取犬只轮询次数
        var inte = parseInt(list.length / 4);
        var rema = list.length % 4;
        if (rema != 0) {
          inte = inte + 1;
        }
        var counts = this.data.counts;
        for (var i = 0; i < inte; i++) {
          counts.push(i + 1);
        }
        this.setData({
          counts: counts
        })
      }
    })
    return;
    var that = this;
    wx.request({
      url: config.BASE_URL + '/dogAndOwner/selectDogBanList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": app.globalData.token
      },
      method: 'GET',
      success: function(res) {
        var data = res.data.result;
        if (!data || data.length <= 0) {
          that.setData({
            isforbidDog: false
          })
          return;
        }
        var forbid_dogs = res.data.result.dogInfos;
        that.setData({
          forbid_dogs: forbid_dogs
        })
        //获取犬只轮询次数
        var inte = parseInt(forbid_dogs.length / 4);
        var rema = forbid_dogs.length % 4;
        if (rema != 0) {
          inte = inte + 1;
        }
        var counts = that.data.counts;
        for (var i = 0; i < inte; i++) {
          counts.push(i + 1);
        }
        that.setData({
          counts: counts
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 获取领养犬只
   */
  getAdoptdogs: function() {
    var that = this;
    var param = {
      pn: 1,
      pageSize: 10,
      status: 1
    }
    app.globalData.http("/adoption/findPublishingList", "get", param)
      .then(res => {
        if (res.data.status == 200) {
          if (!res.data.data || res.data.data.lists.length <= 0) {
            this.setData({
              ishasAdoptdogs: false
            });
            return;
          }
          const list = res.data.data.lists;
          this.setData({
            adoptdogs: list
          })
          //获取犬只轮询次数
          var inte = parseInt(list.length / 10);
          var rema = list.length % 10;
          if (rema != 0) {
            inte = inte + 1;
          }
          var adoptcounts = [];
          for (var i = 0; i < inte; i++) {
            adoptcounts.push(i + 1);
          }
          that.setData({
            adoptcounts: adoptcounts
          })
        }
      })
  },

  /**
   * 跳转到领养犬更多页面
   */
  ToAdoptdogs: function() {
    var that = this;
    var adoptdogs = that.data.adoptdogs;
    wx.navigateTo({
      url: '/pages/home/adoption_list/adoption_list?adoptdogs=' + JSON.stringify(adoptdogs),
    })
  },


  /**
   * 跳转到领养犬只详情
   */
  ToAdoptdogInfo: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var adoptdog_index = JSON.stringify(that.data.adoptdogs[index]);
    wx.navigateTo({
      url: '/pages/home/adoption/adoption?adoptdog_index=' + adoptdog_index,
    })
  },

  /**
   * 跳转到服务网点列表
   */
  ToServiceSites: function() {
    var that = this;
    var serviceSites = that.data.serviceSites;
    wx.navigateTo({
      url: '/pages/my/page/appointment/appointment?serviceSites=' + JSON.stringify(serviceSites),
    })
  },

  /**
   * 跳转到禁养犬种列表
   */
  Toforbid_dogs: function() {
    var that = this;
    var forbid_dogs = that.data.forbid_dogs;
    wx.navigateTo({
      url: '/pages/home/forbid/forbid?forbid_dogs=' + JSON.stringify(forbid_dogs),
    })
  },

  /**
   * 跳转预约详情页面
   */
  ToAppointmentPage: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var serviceSite = JSON.stringify(that.data.serviceSites[index]);
    wx.navigateTo({
      url: '/pages/my/page/appointment/appointment-info/appointment-info?item=' + serviceSite,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getServiceSite();
    that.getforbid_dog();
    that.getAdoptdogs();
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
    // app.getUserInfos();
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