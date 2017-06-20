//index.js
var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    animation_logo: {},
    animation_page: {},
    netWorkType: "",
    userInfo: null
  },
  onShow: function () {
    var animation_logo = wx.createAnimation({
      timingFunction: 'linear',
    })
    animation_logo.scale(1.2, 1.2).rotate(360).step()
    animation_logo.scale(1, 1).step()
    this.setData({
      animation_logo: animation_logo.export()
    })
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
  start_diary: function () {
    util.gotoOtherPage(this, "/pages/diary/diary");
  }
})
