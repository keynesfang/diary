//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    netWorkType: "",
    userInfo: null
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    wx.getNetworkType({
      success: function (res) {
        that.setData({
          netWorkType: res.networkType,
          userInfo: app.globalData.userInfo
        })
      },
    })
  },
  onShareAppMessage: function () {
    return {
      title: '时刻微日记',
      desc: '记录你人生的点点滴滴!',
      path: '/pages/index/index'
    }
  },
  start_diary: function() {
    wx.navigateTo({
      url: '/pages/diary/diary',
    })
  }
})
