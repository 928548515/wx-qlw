// pages/my/page/logout/logout.js
const app = getApp();
const basicUrl = app.globalData.basicUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishasData:true,
    //犬信息列表
    dogInfos: [{
      dogId: '1214121',
      dogName: '犬名', //犬名
      sum: '扣分值', //违法所扣分值
      breed: '品种', //品种
      dogAge: '犬龄1', //犬龄
      colour: '毛色', //毛色
      endTimeStatus: true, //犬证是否过期
      imendTimeStatus: true, //免疫证是否过期
      status: 3, //犬证状态  0待发证，1已发证，2已注销
      url: '/assets/page/my/appoitment/phone-icon.png', //狗图

      //其他信息
      dogCardNum: '0101010', //犬证号
      lssueTime: new Date(), //犬证有效期登记时间--签发时
      immuneCardNum: '1012110', //免疫证号
      injectionDate: new Date(), //疫苗注射时间
      injectionStatus: true, //是否已经注射
      phone: '13352869632', //犬主电话
      dogOwnerName: '张二狗子诶', //犬主姓名
      birthday: new Date(), //出生日期
      sum: -6, //违法所扣分值
    }, ],
    data: ['a', 'b'],
    maxLength: 6, //最大显示
  },
  //点击 注销/查询详情 按钮
  logoutInfo(e) {
    if (3 != e.currentTarget.dataset.id.status) { //未注销的犬 调到注销页面
      wx.navigateTo({
        url: './logoutInfo/logoutInfo?dogId=' + e.currentTarget.dataset.id.dogId,
      })
    }else{//否则显示‘查看详情’ 跳转到犬只详情页面
      wx.navigateTo({
        url: '../pet/petInfo/petInfo?dogId=' + e.currentTarget.dataset.id.dogId,
      })
    }
  },

  getdogs:function(){
    var that = this;
    var userInfo = app.getUserInfo();
    if (!userInfo || userInfo == "") {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }else{
      that.setData({ dogInfos: [] })
      that.initData();//查询列表数据
    }
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
    var that = this;
    that.getdogs();
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
    this.setData({//下拉刷新列表
      maxLength: this.data.page.maxLength * 2
    })
    this.initData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  initData() {
    const _this = this;
    var dogOwnerId = app.globalData.userInfo.dogOwnId;
    wx.request({ //根据犬主id查询犬只详情
      url: basicUrl + "/dogAndOwner/selectMyDogs?ownerId=" + dogOwnerId,
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
        if (res.data.code == '000000') {
          let datas = res.data.result;
          if (!datas || datas.length <= 0) {
            _this.setData({
              ishasData: false
            })
            return;
          } 
          if (datas.length > 0) {
            let dogInfos = [];
            for (let data of datas) {
              dogInfos.push({
                dogId: data.dogId,
                dogName: data.dogName, //犬名
                sum: data.sum, //违法所扣分值
                breed: data.breed, //品种
                dogAge: data.dogAge, //犬龄
                colour: data.colour, //毛色
                endTimeStatus: data.endTime > new Date(), //犬证是否过期
                imendTimeStatus: data.imendTime > new Date(), //免疫证是否过期
                status: data.status, //犬证状态
                url: data.url //狗图
              });
            }
            _this.setData({
              dogInfos
            });
          }
        }
      }
    })
  }
})