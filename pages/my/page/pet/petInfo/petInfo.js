// pages/my/page/pet/petInfo/petInfo.js
const dateformat = require("../../../../../utils/dateFormat.js");
const app = getApp();
const basicUrl = app.globalData.basicUrl;
const picUrlHost = app.globalData.picBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dogOwnerInfo: {}, //犬只信息
    dogInfos: { //详情
      dogInfo: {},
      urlLsit: [],
      immuneCard: {},
      dogCard: {},
      device: {},
      therapyList: [], //病历集合
      vaccineList: [], //防疫信息
      inspectionsInfoList: [], //年检记录集合
      violationList: [], //违法信息集合
    }
  },

  getdogInfo: function() {
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
      let dogId = that.data.dogId; //免疫证号
      that.initData(dogId)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //需要dogId
    if (!options || !options.dogId) {
      wx.navigateBack({
        delta: 1
      }); //没有dogId退回上一页
      return;
    }
    that.setData({
      dogId: options.dogId
    })
  },
  //查看大图
  showImageInfo(e) {
    let picId = e.currentTarget.dataset.picid; //图片id
    let curUrl = ''; //当前点击的图片url
    let urls = []; //原图列表
    this.data.dogInfos.urlLsit.map((item, index) => {
      if (item) {
        urls.push(item.imageUrl);
        if (item.picId == picId) curUrl = item.imageUrl; //当前图片的索引
      }

    })
    wx.previewImage({ //显示原图
      urls,
      current: curUrl
    })
  },

  delImage(e) { //删除图片
    let picId = e.currentTarget.dataset.picid;
    wx.showModal({
      "title": "删除确认",
      "content": "将删除这张图片？",
      showCancel: true,
      confirmText: "狠心删除",
      confirmColor: "#F92627",
      cancelColor: "#3cc51f",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: basicUrl + '/fileManager/' + picId,
            method: "delete",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "token": app.globalData.token
            },
            success: (res) => {
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
              if (res.data.meta.success) {
                this.initData(this.data.dogInfos.dogInfo.dogId)
                wx.showToast({
                  title: '删除成功！',
                })
              } else {
                wx.showToast({
                  title: '删除失败！',
                  "icon": "none"
                })
              }
            }
          })
        }
      }
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
    that.getdogInfo();
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
  //上传图片
  uploadImg(e) { //上传宠物图片
    let _this = this;
    let dogId = this.data.dogInfos.dogInfo.dogId;
    // let dogId = 10101552
    wx.chooseImage({
      success(rsp) {
        if (rsp.tempFiles) {
          let files = rsp.tempFiles;
          files.map(function(value, index) {
            wx.uploadFile({
              url: basicUrl + '/fileManager/uploadFile',
              filePath: value.path,
              name: 'attach',
              formData: {
                Id: dogId,
                type: 2, //图片类型 犬2
              },
              header: {
                "Content-Type": "multipart/form-data",
                "token": app.globalData.token
              },
              success(res) {
                //判断是否过期
                var isexpire = app.isLoginExpire(res);
                if (isexpire) {
                  that.setData({
                    isLogin: false,
                  })
                  return;
                }
                if (res.statusCode == 200 && res.data) {
                  let url = JSON.parse(res.data).url;
                  let newPic = {
                    imageUrl: url,
                    isShow: true,
                    picId: '',
                    thumbnailUrl: url,
                  }
                  _this.data.dogInfos.urlLsit.push(newPic);
                  _this.setData({
                    dogInfos: _this.data.dogInfos
                  });
                  wx.showToast({
                    'title': 'success!',
                    'icon': 'success'
                  })
                } else {
                  wx.showToast({
                    'title': '网络错误！',
                    'icon': 'none'
                  })
                }
              }
            })
          });
        }
      }
    })

  },
  initData(dogId) { //查询详细数据
    const _this = this;
    wx.request({ //根据犬主id查询犬只详情
      url: basicUrl + "/dogCard/selectDogCardInfo?dogId=" + dogId,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": app.globalData.token
      },
      success(res) {
        //判断是否过期
        var isexpire = app.isLoginExpire(res);
        if (isexpire) {
          that.setData({
            isLogin: false,
          })
          return;
        }
        if (res.data.code == '000000') {
          let datas = res.data.result;
          if (!datas) {
            return;
          }

          let dogInfos = _this.data.dogInfos; //数据
          //狗照片url集合
          let urlLsit = [];
          if (datas.urlLsit) {
            for (let urlBean of datas.urlLsit) {
              urlLsit.push({
                imageUrl: urlBean.imageUrl,
                thumbnailUrl: urlBean.thumbnailUrl,
                picId: urlBean.picId,
                isShow: true, //默认不删除
              });
            }
          }
          //病历集合
          let therapyList = [];
          if (datas.therapyList) {
            for (let therapyof of datas.therapyList) {
              therapyList.push({
                orgName: therapyof.orgName,
                creationTime: dateformat(therapyof.creationTime, "yyyy年MM月dd日"),
                symptom: therapyof.symptom, //症状
                diagnose: therapyof.diagnose, //诊断
                treatmentInfo: therapyof.treatmentInfo, //治疗
                remarks: therapyof.remarks, //备注
              });
            }
          }
          //诊疗集合
          let vaccineList = [];
          if (datas.vaccineList) {
            for (let therapyof of datas.vaccineList) {
              vaccineList.push({
                name: therapyof.name, //接种兽医名称
                orgName: therapyof.orgName, //接种单位名称
                injectionTime: dateformat(therapyof.injectionTime, "yyyy年MM月dd日"), //注射时间
                vaccineName: therapyof.vaccineName, //疫苗名称
                vaccineProducer: therapyof.vaccineProducer, //厂家
                vaccineNo: therapyof.vaccineNo, //疫苗编号
              });
            }
          }
          //inspectionsInfoList 年检集合
          let inspectionsInfoList = [];
          if (datas.inspectionsInfoList) {
            for (let inspectionsInfo of datas.inspectionsInfoList) {
              inspectionsInfoList.push({
                inspectionsDate: dateformat(inspectionsInfo.inspectionsDate, "yyyy年MM月dd日"), //年检时间
                resultType: inspectionsInfo.resultType, //结果
              });
            }
          }
          //violationList,//违法信息集合
          let violationList = [];
          if (datas.violationList) {
            for (let violation of datas.violationList) {
              violationList.push({
                violationDate: violation.violationDate, //违法时间
                violationPlace: violation.violationPlace, //地点
                violation: violation.violation, //行为
                fine: violation.fine, //扣分
                fine: violation.fine, //罚款
              });
            }
          }
          //犬的信息
          let dogInfo;
          if (datas.dogInfo) {
            dogInfo = {
              dogId: datas.dogInfo.dogId, //犬id
              dogOwnerId: datas.dogInfo.dogOwnerId, //犬主id
              dogBreedType: datas.dogInfo.dogBreedType, //犬品种类型
              dogName: datas.dogInfo.dogName, //犬名
              dogGender: datas.dogInfo.dogGender, //性别
              weight: datas.dogInfo.weight, //体重(kg)
              fatherId: datas.dogInfo.fatherId, //父本
              motherId: datas.dogInfo.motherId, //母本
              breed: datas.dogInfo.breed, //品种名称
              dogAge: datas.dogInfo.dogAge, //犬龄
              color: datas.dogInfo.color, //毛色
            }
          }
          let immuneCard;
          if (datas.immuneCard) {
            immuneCard = { //免疫证信息
              orgId: datas.immuneCard.orgId, //机构id
              orgName: datas.immuneCard.orgName, //机构名称
              seqId: datas.immuneCard.seqId,
              immuneCardNum: datas.immuneCard.immuneCardNum,
              startTime: dateformat(datas.immuneCard.startTime, "yyyy年MM月dd日"),
              endTime: dateformat(datas.immuneCard.endTime, "yyyy年MM月dd日"),
              lssueTime: dateformat(datas.immuneCard.lssueTime, "yyyy年MM月dd日"), //签发时间
              status: datas.immuneCard.status,
            }
          }
          let dogCard;
          if (datas.dogCard) {
            dogCard = { //犬证对象
              orgId: datas.dogCard.orgId, //机构id
              orgName: datas.dogCard.orgName, //机构名称
              seqNum: datas.dogCard.seqNum,
              dogId: datas.dogCard.dogId,
              dogOwnerId: datas.dogCard.dogOwnerId,
              memberCardId: datas.dogCard.memberCardId,
              dogCardNum: datas.dogCard.dogCardNum,
              startTime: dateformat(datas.dogCard.startTime, "yyyy年MM月dd日"),
              endTime: dateformat(datas.dogCard.endTime, "yyyy年MM月dd日"),
              lssueTime: dateformat(datas.dogCard.lssueTime, "yyyy年MM月dd日"), //签发时间 
              lssueOrgId: datas.dogCard.lssueOrgId,
              lssuerId: datas.dogCard.lssuerId,
              status: datas.dogCard.status,
              creationTime: dateformat(datas.dogCard.creationTime, "yyyy年MM月dd日"),
            }
          }
          let device;
          if (datas.device) {
            device = { //设备对象
              orgId: datas.device.orgId, //机构id
              orgName: datas.device.orgName, //机构名称
              endTime: datas.device.endTime, //设备有效结束时间
              LongdeviceId: datas.device.LongdeviceId,
              deviceNumber: datas.device.deviceNumber,
              deviceStatus: datas.device.deviceStatus,
              startTime: dateformat(datas.device.startTime, "yyyy年MM月dd日"),
              deviceBrand: datas.device.deviceBrand,
              deviceModel: datas.device.deviceModel,
              productionTime: dateformat(datas.device.productionTime, "yyyy年MM月dd日"),
              deviceRemarks: datas.device.deviceRemarks,
              deviceType: datas.device.deviceType,
              creationTime: dateformat(datas.device.creationTime, "yyyy年MM月dd日"),
            }
          }
          _this.setData({
            dogInfos: {
              urlLsit, //狗照片url集合
              therapyList, //病历集合           
              vaccineList, //诊疗集合
              inspectionsInfoList, //年检集合
              violationList, //违法信息集合          
              dogInfo, // //犬的信息
              immuneCard, //免疫证信息
              dogCard, //犬证对象
              device, //设备对象
            }
          });
        }
      }
    })
  }
})