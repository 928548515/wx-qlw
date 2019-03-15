//点击 二维码扫描
const {
  BASE_URL: basicUrl
} = require("./config.js")


function _scanCode() {
  return new Promise((resolve, reject) => {
    wx.scanCode({
      scanType: ["qrCode"], //只能扫描二维码
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    })
  })
}

function _showModal(deviceNo) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '扫描结果',
      content: '扫描结果: ' + deviceNo,
      success(e2) {
        //点击了确定按钮
        if (e2.confirm) {
          resolve(deviceNo)
        } else if (e2.cancel) {
          reject(deviceNo)
        }
      }
    });
  })
}
/**
 * e  源数据
 * isShowModal 是否显示对话框
 */
module.exports = function scanCode(isShowModal) {
  let promise = new Promise((resolve, reject) => {
    wx.scanCode({
      scanType: ["qrCode"], //只能扫描二维码
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    })
  })
  if (isShowModal) {
    return promise.then(res => {
      return new Promise((resolve, reject) => {
        const deviceNo = res.result
        wx.showModal({
          title: '扫描结果',
          content: '扫描结果: ' + deviceNo,
          success(e2) {
            //点击了确定按钮
            if (e2.confirm) {
              resolve(deviceNo)
            } else if (e2.cancel) {
              reject(deviceNo)
            }
          }
        });
      })
    })
  }
  return promise;
}