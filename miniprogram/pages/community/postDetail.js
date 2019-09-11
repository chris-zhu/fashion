// pages/community/postDetail.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postId: '',
    post: null, //帖子
    postTime: '14:01', //帖子时间
    imgwidth: 750, //
    imgheights: [],
    current: 0, //轮播的索引
    followPosts: [],
    reply_bottom: 0,
    domHeight: 0,
    isBottom: true,
    phoneInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    this.setData({
      postId: options._id
    })
    this.getPost()
    this.loadAllPosts()

    this.getPhoneInfo()
  },
  getPhoneInfo() {
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
      },
    })
  },
  getPostHeight() {
    let that = this
    const query = wx.createSelectorQuery()
    query.select('#head').fields({
      id: true,
      size: true
    }, res => {
      // console.log(res)
      that.setData({
        domHeight: res.height
      })
    }).exec()
  },
  loadAllPosts() {
    let that = this
    db.collection('posts')
      .get({
        success: function(res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res.data)
          that.setData({
            followPosts: res.data
          })
        }
      })
  },
  imageLoad: function(e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights,
    })
  },
  bindchange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  getPost() {
    let that = this
    db.collection('posts').doc(this.data.postId).get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data)
      let post = res.data
      if (app.isLogin()) {
        let userId = app.getUser()._id;
        if (post.likesArr.indexOf(userId) != -1) {
          //这个帖子用户已经点赞
          post.alreadyLike = true
        } else {
          //未点赞
          post.alreadyLike = false
        }
        if (post.collectArr.indexOf(userId) != -1) {
          //这个帖子用户已经收藏
          post.alreadyCollect = true
        } else {
          //未收藏
          post.alreadyCollect = false
        }
      } else {
        //如果用户未登录
        post.alreadyLike = false
        post.alreadyCollect = false
      }
      that.setData({
        post: post
      })
    })
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
  like() {
    let that = this
    if (app.isLogin()) {
      let userid = app.getUser()._id;
      let _ = db.command
      if (that.data.post.alreadyLike) {
        //取消点赞
        let post = that.data.post
        post.alreadyLike = false
        post.likenum--;
        that.setData({
          post: post
        })
        let arrLike = post.likesArr
        let index = arrLike.indexOf(userid)
        arrLike.splice(index, 1)
        db.collection('posts').doc(that.data.postId).update({
          data: {
            likenum: _.inc(-1),
            likesArr: arrLike
          },
          success: function(res) {
            console.log(res)
          }
        })
      } else {
        //增加点赞
        let post = that.data.post
        post.alreadyLike = true
        post.likenum++;
        that.setData({
          post: post
        })
        db.collection('posts').doc(that.data.postId).update({
          data: {
            likenum: _.inc(1),
            likesArr: _.push(userid)
          }
        })
      }
    } else {
      console.log('请登录')
    }
  },
  collect() {
    let that = this
    if (app.isLogin()) {
      let userid = app.getUser()._id;
      let _ = db.command
      if (that.data.post.alreadyCollect) {
        //取消收藏
        let post = that.data.post
        post.alreadyCollect = false
        post.collectnum--;
        that.setData({
          post: post
        })
        let arrCollect = post.collectArr
        let index = arrCollect.indexOf(userid)
        arrCollect.splice(index, 1)
        db.collection('posts').doc(that.data.postId).update({
          data: {
            collectnum: _.inc(-1),
            collectArr: arrCollect
          },
          success: function(res) {
            console.log(res)
          }
        })
      } else {
        //增加点赞
        let post = that.data.post
        post.alreadyCollect = true
        post.collectnum++;
        that.setData({
          post: post
        })
        db.collection('posts').doc(that.data.postId).update({
          data: {
            collectnum: _.inc(1),
            collectArr: _.push(userid)
          }
        })
      }
    } else {
      console.log('请登录')
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onPageScroll(e) {
    if (this.data.isBottom) {
      this.getPostHeight()
    }
    if (e.scrollTop > this.data.domHeight) {
      this.setData({
        reply_bottom: -100
      })
    } else {
      this.setData({
        reply_bottom: 0
      })
    }
  }
})