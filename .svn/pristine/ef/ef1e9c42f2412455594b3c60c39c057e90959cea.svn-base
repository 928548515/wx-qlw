/**
 * name: api.js
 * description: request处理基础类
 * author: 彭雨
 * date: 2018-5-19
 */
const config = require("config.js"); //引入配置文件文件
const basicUrl = config.BASE_URL;


//上传图片
function uploadImg(type, id, isReturn = true) { //上传图片
  return new Promise((resolve, reject) => {
    openImg()
      .then(res => {
        res.map(x => {
          if (isReturn) {
            upload(x.path, type, id).then(resolve).catch(reject)
          } else {
            upload(x.path, type, id).then(res => {
              if (res.statusCode == 200) {
                wx.showToast({
                  title: '上传成功！',
                })
              } else {
                wx.showToast({
                  title: '上传失败！',
                  icon: 'none'
                })
              }
            })
          }
        })
      }).catch(res => {
        wx.showToast({
          title: '上传出错！',
          icon: 'none'
        })
      })
  })
  // openImg()
  //   .then(res => {
  //     res.map(x => {
  //       upload(x.path, type, id)
  //         .then(res => {
  //           if (res.statusCode == 200) {
  //             wx.showToast({
  //               title: '上传成功！',
  //             })
  //           } else {
  //             wx.showToast({
  //               title: '上传失败！',
  //               icon: 'none'
  //             })
  //           }
  //         })
  //     })
  //   }).catch(res => {
  //     wx.showToast({
  //       title: '上传出错！',
  //       icon: 'none'
  //     })
  //   })
}

//打开图片
function openImg() {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      success: (res) => {
        resolve(res.tempFiles)
      },
      fail: reject
    })
  })
}

function upload(path, type, id) {
  return new Promise((resolve, reject) => {
    let app = getApp();
    wx.uploadFile({
      url: basicUrl + '/fileManager/uploadFile',
      filePath: path,
      name: 'attach',
      formData: {
        type,
        Id:id
      },
      header: {
        "Content-Type": "multipart/form-data",
        "token": app.globalData.token
      },
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject(res)
      }
    })
  })
}


uploadImg.upload = upload;
//暴露接口
module.exports = uploadImg;