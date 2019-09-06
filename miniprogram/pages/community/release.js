const app = getApp()
Page({
  data: {
    files: [],
    currentTxtLen: 0,
    maxTxtLen: 200,
    content: '',
    locationTxt: '',
    talkTxt: ''
  },
  onLoad() {
    this.setData({
      uploadFile: this.uploadFile.bind(this)
    })
  },
  commit() {
    console.log(this.data.files)
  },
  updateImgFiles(options) {
    console.log(options)
  },
  selectGoods() {
    wx.showToast({
      title: "(X﹏X)  暂时没有商品可以选择。",
      icon: "none"
    })
  },
  onShow() {
    console.log(app.globalData)
    let locationTxt = app.globalData.locationInfo ? app.globalData.locationInfo.name : '打卡纪念'
    let talkTxt = app.globalData.talkInfo ? '#' + app.globalData.talkInfo.name : 'Select Your Tag'
    this.setData({
      locationTxt: locationTxt,
      talkTxt: talkTxt
    })
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  uploadFile(files) {
    console.log('upload files', files)
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '上传中',
      })
      let json = {
        urls: []
      }
      files.tempFilePaths.forEach((ele, i) => {
        let filePath = ele;
        //文件路径
        let cloudPath = `userImgs/my-image_${i}_${new Date().getTime()}${filePath.match(/\.[^.]+?$/)[0]}`;
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            json.urls.push(res.fileID)
            if (i == files.tempFilePaths.length - 1) {
              setTimeout(() => {
                resolve(json)
              }, 500)
            }
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
            reject('error')
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      })
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    let files = e.detail.map((ele) => {
      return ele.url
    })
    this.setData({
      files: files
    })
    console.log('upload success', this.data.files)
  },
  deleteImg(e, m) {
    let deleteArr = e.detail;
    let index = this.data.files.indexOf(deleteArr[0])
    if (index != -1) {
      this.data.files.splice(index, 1);
    }
    this.setData({
      files: this.data.files
    })
    wx.cloud.deleteFile({
      fileList: deleteArr
    }).then(res => {
      // handle success
      console.log("删除成功", res.fileList)
    }).catch(error => {
      // handle error
    })
  },
  editInput(event) {
    if (event.detail.value.length <= this.data.maxTxtLen) {
      this.data.content = event.detail.value
      this.data.currentTxtLen = event.detail.value.length
      this.setData({
        content: this.data.content,
        currentTxtLen: this.data.currentTxtLen
      })
    }
  }

});