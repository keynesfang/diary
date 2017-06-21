// write.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: null,
    diary_date: "",
    input_diary_content: "",
    diary_content: [
      {
        content: '测试信息内容',
        time: '20170101'
      }
    ],
    direction: "left",
    send_status: true
  },
  onLoad: function (options) {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    });
  },
  onShow: function () {
    util.showCurrentPage(this);
    var that = this;
    wx.getStorage({
      key: 'diary_date',
      success: function (res) {
        that.setData({
          diary_date: res.data
        });
      }
    });
  },
  bindDiaryInput: function (e) {
    var last_diary_content_index = this.data.diary_content.length - 1;
    this.data.diary_content[last_diary_content_index].content = e.detail.value;
    if (e.detail.value.length > 0) {
      this.data.send_status = false;
    } else {
      this.data.send_status = true;
    }
    this.setData({
      diary_content: this.data.diary_content,
      send_status: this.data.send_status
    });
  },
  gen_diary_content: function() {
    var new_diary_content = 
    {
      direction: "left",
      content: '',
      time: ''
    };
    this.data.diary_content.push(new_diary_content);
    this.setData({
      diary_content: this.data.diary_content,
      send_status: true,
      input_diary_content: ""
    });
  }
})