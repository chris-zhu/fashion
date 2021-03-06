// pages/mine/signRule.js
import Dialog from '../../libray/dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReadMe: false,
    isSign: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.from == 'readme') {
      this.setData({
        isReadMe: true
      })
      wx.setNavigationBarTitle({
        title: '开发者说明',
      })
    } else if (options.from == 'sign') {
      this.setData({
        isSign: true
      })
      wx.setNavigationBarTitle({
        title: '签到说明',
      })
    }
  },
  toAdmin() {
    Dialog.alert({
      title: 'ヽ(✿ﾟ▽ﾟ)ノ',
      message: '好吧，我就把我的qq和微信告诉你吧\nQQ: 1633711653\nWeChat: 13198176261'
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

  }
})