// pages/my/page/pet/pet.js
const app = getApp();
const basicUrl = app.globalData.basicUrl;
const picUrlHost = app.globalData.picBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishasData: true,
    //犬信息列表
    dogInfos: [{
      dogId: '', //犬id
      dogName: '犬名', //犬名
      sum: '扣分值', //违法所扣分值
      breed: '品种', //品种
      dogAge: '犬龄', //犬龄
      colour: '毛色', //毛色
      endTimeStatus: true, //犬证是否过期
      imendTimeStatus: true, //免疫证是否过期
      status: 3, //犬证状态
      url: '/assets/page/my/pet/dog-titile.png', //狗图
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
      immuneCardNum: 0, //免疫证id
    }],
    pageSize: 7, //最大条数
    dogOwnerId: '', //犬主id
  },
  //绑定
  toDevice(e) {
    const dogInfo = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/my/page/bindDeivce/bindDevice?dogInfo=' + dogInfo,
    })
  },
  //解绑
  toUnBindDevice(e) {
    const dogInfo = e.currentTarget.dataset.item;
    wx.showModal({
      title: '解绑“' + dogInfo.dogName +'”的项圈？',
      content: '确定要解绑犬“' + dogInfo.dogName + '”的项圈“' + dogInfo.imei +'”吗？',
      success:(res)=>{
        if (res.confirm){
          app.globalData.http("/dogCard/unBindDevice","post",{
            dogId: dogInfo.dogId,
            deviceId: dogInfo.deviceId
          }).then(res=>{
            if(res.data.meta.success){
              wx.showModal({
                title: '解绑项圈',
                content: '项圈“' + dogInfo.imei+'”解绑成功！',
                showCancel: false,
                complete:()=>{
                  this.lists()
                }
              })
            }else{
              wx.showModal({
                title: '解绑项圈',
                content: '项圈“' + dogInfo.imei + '”解绑失败！',
              })
            }
          })
        }
      }
    })
    // wx.navigateTo({
    //   url: '/pages/my/page/unBindDevice/unBindDevice?dogInfo=' + dogInfo,
    // })
  },
  getlists: function() {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    if (!userInfo || userInfo == "") {
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }, 1500)
      return;
    } else {
      that.setData({
        dogInfos: []
      })
      that.setData({
        dogOwnerId: app.globalData.userInfo.dogOwnId
      })
      that.lists(); //加载列表
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opts) {

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
    that.getlists();
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
    this.lists()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({ //下拉展示更多
      pageSize: this.data.pageSize * 2
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //查询犬只列表
  lists() {
    wx.showLoading({
      "title": "loading..."
    })
    let dogOwnerId = this.data.dogOwnerId // 1102221;
    let _this = this;
    wx.request({ //根据犬主id查询犬只信息
      url: basicUrl + "/dogAndOwner/selectMyDogs?ownerId=" + dogOwnerId,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": app.globalData.token
      },
      success(res) {
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
                dogName: data.dogName.length <= 10 ? data.dogName : data.dogName.substr(0,10)+"...", //犬名
                sum: data.sum, //违法所扣分值
                breed: data.breed, //品种
                dogAge: data.dogAge, //犬龄
                colour: data.colour, //毛色
                endTimeStatus: data.endTime > new Date(), //犬证是否过期
                imendTimeStatus: data.imendTime > new Date(), //免疫证是否过期
                status: data.bindStatus, //犬证状态
                url: data.url ? data.url : "/assets/dogs/example-dog.png", //狗图
                immuneCardNum: data.immuneCardNum, //免疫证号
                dogCardNum: data.dogCardNum, //犬证号
                imei:data.imei,
                deviceId: data.deviceId
              });
            }
            _this.setData({
              dogInfos
            });
          }

        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  }

})