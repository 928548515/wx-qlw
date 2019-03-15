// pages/dogcardHandle/dogCardHandle.js
const request = require("../../apis/request.js");
const {
  asynHttp
} = require("../../apis/request_sync.js");
const config = require("../../apis/config.js");
const basicUrl = config.BASE_URL;
const dateUtiles = require("../../utils/dateUtils.js");
const dateFormat = require("../../utils/dateFormat.js");
const upload = require("../../apis/upload.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    input: '', //输入的免疫证号码
    nameInput: '', //姓名
    phoneInput: '', //电话
    cardInput: '', //证件号码
    dogInfo: '', //查询的犬只信息
    pickerSex: {
      array: ["请选择性别", "男", "女"],
      index: 0,
    },
    pickerEthnic: {
      array: ["请选择名族", "汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族",
        "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
        "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族",
        "俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"
      ],
      index: 0,
    },
    pickerBirthDate: '请选择出生日期',
    pickerCardType: { //收容犬类型数据
      cardTypes: [], //元数据
      array: [],
      index: 0,
    },
    pickerInputCardType: { //收容犬类型输入的数据
      cardTypes: [], //元数据
      array: [],
      index: 0,
    },
    delPics: [],
    addPics: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.findCradTypes()

  },
  nameChange(e) {
    this.setData({
      nameInput: e.detail.value
    })
  },
  cardChange(e) {
    this.setData({
      cardInput: e.detail.value
    })
  },
  phoneChange(e) {
    this.setData({
      phoneInput: e.detail.value
    })
  },
  findCradTypes() {
    asynHttp("/Tdictionary/card_type")
      .then(res => {
        if (res.data.meta.success) {
          let pickerCardType = {};
          pickerCardType.cardTypes = res.data.data;
          pickerCardType.array = res.data.data.map(x => x.dictionaryDescribe);
          pickerCardType.index = 0;
          pickerCardType.array.unshift("请选择证件类型");
          this.setData({
            pickerCardType,
            pickerInputCardType: pickerCardType
          })
        }
      })
  },

  //查看大图 犬
  viewDogBigPic(e) {
    const picIndex = e.currentTarget.dataset.index; //图片index
    //原图列表
    const urls = this.data.dogInfo.tDogInfoImages.map(x => x.tImages.imageUrl);
    //显示原图
    wx.previewImage({
      urls,
      current: this.data.dogInfo.tDogInfoImages[picIndex].tImages.imageUrl
    })
  },
  //查看大图 犬主 半身照
  viewhalfBigPic(e) {
    const picIndex = e.currentTarget.dataset.index; //图片index
    //原图列表
    const urls = this.data.dogInfo.halfPics.map(x => x.tImages.imageUrl);
    //显示原图
    wx.previewImage({
      urls,
      current: this.data.dogInfo.halfPics[picIndex].tImages.imageUrl
    })
  },
  //查看大图 犬主 正面
  viewfrontBigPic(e) {
    const picIndex = e.currentTarget.dataset.index; //图片index
    //原图列表
    const urls = this.data.dogInfo.frontPics.map(x => x.tImages.imageUrl);
    //显示原图
    wx.previewImage({
      urls,
      current: this.data.dogInfo.frontPics[picIndex].tImages.imageUrl
    })
  },
  //查看大图 犬主 反面
  viewrearPicsBigPic(e) {
    const picIndex = e.currentTarget.dataset.index; //图片index
    //原图列表
    const urls = this.data.dogInfo.rearPics.map(x => x.tImages.imageUrl);
    //显示原图
    wx.previewImage({
      urls,
      current: this.data.dogInfo.rearPics[picIndex].tImages.imageUrl
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
  //输入变化
  inputChange(e) {
    this.setData({
      input: e.detail.value
    })
  },
  //上传图片
  uploadImg(e) { //上传犬主图片
    //图片类型   11 半身照 12 正面 13 反面
    const pictype = e.currentTarget.dataset.type;
    wx.chooseImage({
      success: (rsp) => {
        if (rsp.tempFiles) {
          const filePaths = rsp.tempFiles.map(x => x.path)
          rsp.tempFiles.map(x => {
            if (pictype == "11") { //半身照
              this.data.dogInfo.halfPics.push({
                tImages: {
                  thumbnailUrl: x.path,
                  imageUrl: x.path
                }
              });
            } else if (pictype == "12") { //正面
              this.data.dogInfo.frontPics.push({
                tImages: {
                  thumbnailUrl: x.path,
                  imageUrl: x.path
                }
              });
            } else if (pictype == "13") { //反面
              this.data.dogInfo.rearPics.push({
                tImages: {
                  thumbnailUrl: x.path,
                  imageUrl: x.path
                }
              });
            }
            this.setData({
              dogInfo: this.data.dogInfo
            })
            this.data.addPics.push({
              path: x.path,
              pictype
            })
            this.setData({
              addPics: this.data.addPics
            })
          })
        }
      }
    })

  },
  reset() {
    this.setData({
      input: '', //输入的免疫证号码
      dogInfo: '', //查询的犬只信息
      delPics: [],
      addPics: [],
      nameInput: '', //姓名
      phoneInput: '', //电话
      cardInput: '', //证件号码
    })
  },
  delImage(e) { //删除图片
    let pictype = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;

    let picId = e.currentTarget.dataset.picid;
    wx.showModal({
      "title": "删除确认",
      "content": "将删除这张图片？",
      showCancel: true,
      confirmText: "删除",
      confirmColor: "#F92627",
      cancelColor: "#3cc51f",
      success: (res) => {
        if (res.confirm) {
          if (pictype == "1") { //半身照
            this.data.dogInfo.halfPics.splice(index, 1);
          } else if (pictype == "2") { //正面
            this.data.dogInfo.frontPics.splice(index, 1);
          } else if (pictype == "3") { //反面
            this.data.dogInfo.rearPics.splice(index, 1);
          }
          this.setData({
            dogInfo: this.data.dogInfo
          })
          if (picId) {
            this.data.delPics.push(picId)
            this.setData({
              delPics: this.data.delPics
            })
          }
          return;
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
  submit(e) {
    if (!this.data.dogInfo || !this.data.dogInfo.tImmuneCard) {
      wx.showToast({
        title: '还没有免疫证信息无法提交办理',
        icon: 'none'
      })
      return;
    }
    let {
      phone,
      address,
      birthDate,
      cradType,
      cardNum,
      community,
      dogOwnerName,
      eMail,
      ethnic,
      sex
    } = e.detail.value;
    ethnic = this.data.pickerEthnic.array[ethnic]
    // sex = this.data.pickerSex.array[ethnic]

    if (!dogOwnerName || dogOwnerName.trim().length < 2) {
      wx.showToast({
        title: '姓名至少填写二个字符！',
        icon: 'none'
      })
      return;
    }
    if (!cardNum || cardNum.trim().length == 0) {
      wx.showToast({
        title: '证件信息必须填写！',
        icon: 'none'
      })
      return;
    }

    const {
      halfPics,
      frontPics,
      rearPics
    } = this.data.dogInfo;
    if (!halfPics || halfPics.length == 0) {
      wx.showToast({
        title: '请选择至少一张半身照！',
        icon: 'none'
      })
      return;
    }
    if (!frontPics || frontPics.length == 0) {
      wx.showToast({
        title: '请选择至少一张身份证正面照！',
        icon: 'none'
      })
      return;
    }
    if (!rearPics || rearPics.length == 0) {
      wx.showToast({
        title: '请选择至少一张身份证背面照！',
        icon: 'none'
      })
      return;
    }
    let saveParams = {
      dogId: this.data.dogInfo.tDogInfo.dogId, //犬id
      dogOwnerId: this.data.dogInfo.tDogOwner.dogOwnerId, //犬主id
      // memberCardId:null,//会员证id
      // dogCardNum,//证书编号
      // startTime,//犬证有效期开始时间
      // endTime,//犬证有效期结束时间
      // lssueTime,//犬证签发时间
      // lssueOrgId,//发证机构id
      // lssuerId,//签发人，办理人
      status: 4, //犬证状态
      // deviceId,//设备id
      useStatus: 0, //使用状态
      // creationTime,//设备创建时间/有效起始时间
      // expireTime,//设备过期时间
      phone, //电话
      name: dogOwnerName, //姓名
      gender: sex, //性别
      email: eMail, //邮箱
      // orgType,//机构类型
      ethnic, //名族
      birthday: birthDate, //生日
      cardType: cradType-1, //证件类型
      cardNum, //证件号码
      // dogOwnerCardId,//证件id
      // districtId,//现住区县id
      street: community, //所属街道
      addrees: address, //详细地址
    }
    const temp = this.data.dogInfo.tDogOwnerCardVo
    if (temp && temp.length > 0) {
      saveParams.dogOwnerCardId = temp[0].dogOwnerCardId;
    }

    // console.log(saveParams)
    // 保存 commit 
    asynHttp("/dogCard/insertDogCard", "post", JSON.stringify(saveParams), {
        "content-type": "application/json"
      }, "正在提交...")
      .then(res => {
        let str = "申办成功！";
        if (res.data.code == '000000') {
          str = "申办成功！";
        }
        //图片处理
        this.savePics()
        wx.showModal({
          title: '犬证申办',
          content: str,
          cancelText:"返回",
          confirmText:"继续办理",
          success:(res)=>{
            if (res.confirm){
              this.reset();
            }
            if (res.cancel){
              //返回
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
  },
  savePics() {
    let {
      addPics,
      delPics
    } = this.data;
    //新增图片
    if (addPics && addPics.length > 0) {
      for (let pic of addPics) {
        upload.upload(pic.path, pic.pictype, this.data.dogInfo.tDogOwner.dogOwnerId)
          .then(res => {
            if (!res.data || JSON.parse(res.data).error != 0) {
              wx.showToast({
                title: '图片保存失败',
                icon: "none"
              })
            }
          })
      }
    }
    //remove图片
    if (delPics && delPics.length > 0) {
      for (let picId of delPics) {
        asynHttp("/fileManager/" + picId, "DELETE")
          .then(res => {
            if(!res.data.meta.success){
              wx.showToast({
                title: '图片删除失败',
                icon: "none"
              })
            }
          })
      }
    }
  },
  searchInfo(e) {
    const immuneCardNum = this.data.input.trim();
    const dogOwnerName = this.data.nameInput.trim();
    const phone = this.data.phoneInput.trim();
    const cardType = this.data.pickerInputCardType.index - 1;
    const cardNum = this.data.cardInput.trim();
    if (!immuneCardNum || immuneCardNum.length == 0) {
      wx.showToast({
        title: '免疫证号必须填写',
        icon: 'none'
      })
      return;
    }
    if (!dogOwnerName || dogOwnerName.length == 0) {
      wx.showToast({
        title: '犬主姓名必须填写',
        icon: 'none'
      })
      return;
    }
    if (!phone || phone.length == 0) {
      wx.showToast({
        title: '犬主电话必须填写',
        icon: 'none'
      })
      return;
    }
    if (!(/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(phone))) {
      wx.showToast({
        title: '犬主电话格式错误',
        icon: 'none'
      })
      return;
    }
    if (cardType < 0) {
      wx.showToast({
        title: '证件类型必须选择',
        icon: 'none'
      })
      return;
    }
    if (!cardNum || cardNum.trim().length == 0) {
      wx.showToast({
        title: '证件号码必须填写',
        icon: 'none'
      })
      return;
    }
    asynHttp("/dogCard/handle/checkd", "get", {
        immuneCardNum,
        dogOwnerName,
        phone,
        cardType,
        cardNum
      }, null, "正在处理,请稍后...")
      .then(res => {
        if (res.data.meta.success) {
          if (res.data.data.length > 0) {
            if (res.data.data[0].tDogCard && res.data.data[0].tDogCard.seqNum ) {
              wx.showToast({
                title: '该免疫证已经办理过办证',
                icon: 'none',
                duration: 2000
              })
              return;
            }
            //组装数据
            const datePattern = "yyyy-MM-dd"
            res.data.data.map(x => {
              x.tImmuneCard.creationTime = dateFormat(x.tImmuneCard.creationTime, datePattern);
              x.tDogOwner.birthDate = dateFormat(x.tDogOwner.birthDate, datePattern);
              x.tDogInfo.age = getAge(x.tDogInfo.birthTime);
              //半身照
              x.halfPics = x.tDogOwnerImages.filter(x => x.tImagesRef.targetType == 11)
              //正面照
              x.frontPics = x.tDogOwnerImages.filter(x => x.tImagesRef.targetType == 12)
              //反面照
              x.rearPics = x.tDogOwnerImages.filter(x => x.tImagesRef.targetType == 13)

              //犬主信息
              this.data.pickerSex.index = x.tDogOwner.sex == 0 ? 1 : x.tDogOwner.sex == 1 ? 2 : 0;
              this.setData({
                pickerSex: this.data.pickerSex
              })

              let index = this.data.pickerEthnic.array.indexOf(x.tDogOwner.ethnic);
              if (index > 0) {
                this.data.pickerEthnic.index = index;
                this.setData({
                  pickerEthnic: this.data.pickerEthnic
                });
              }

              let birthDate = x.tDogOwner.birthDate;
              if (birthDate) {
                this.data.pickerBirthDate = birthDate;
                this.setData({
                  pickerBirthDate: this.data.pickerBirthDate
                });
              }

              let tDogOwnerCardVos = x.tDogOwnerCardVo && x.tDogOwnerCardVo.length > 0 ? x.tDogOwnerCardVo : null;
              if (tDogOwnerCardVos) {
                let cardType = tDogOwnerCardVos[0].ownerCardTypeic.dictionaryDescribe;
                let cardTypeIndex = this.data.pickerCardType.array.indexOf(cardType);
                if (cardTypeIndex > 0) {
                  this.data.pickerCardType.index = cardTypeIndex;
                  this.setData({
                    pickerCardType: this.data.pickerCardType
                  });
                }
              }

            })
            this.setData({
              dogInfo: res.data.data[0]
            })

          } else { //没有免疫证信息
            wx.showToast({
              title: "输入的办证信息不正确",
              icon: 'none',
              duration: 2000
            })
          }
        } else { //检验参数异常
          wx.showToast({
            title: res.data.meta.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
  },
  pickerBirthDateChange(e) {
    this.setData({
      "pickerBirthDate": e.detail.value
    })
  },
  pickerCardTypeInputChanged(e) {
    this.data.pickerInputCardType.index = e.detail.value
    this.setData({
      pickerInputCardType: this.data.pickerInputCardType
    })
  },
  pickerCardTypeChanged(e) {
    this.data.pickerCardType.index = e.detail.value
    this.setData({
      pickerCardType: this.data.pickerCardType
    })
  },
  pickerEthnicChanged(e) {
    this.data.pickerEthnic.index = e.detail.value
    this.setData({
      pickerEthnic: this.data.pickerEthnic
    })
  },
  pickerSexChanged(e) {
    this.data.pickerSex.index = e.detail.value
    this.setData({
      pickerSex: this.data.pickerSex
    })
  }
})

function getAge(birthday) {
  //出生时间 毫秒
  var birthDayTime = new Date(birthday).getTime();
  //当前时间 毫秒
  var nowTime = new Date().getTime();
  //一年毫秒数(365 * 86400000 = 31536000000)
  return Math.ceil((nowTime - birthDayTime) / 31536000000);
}