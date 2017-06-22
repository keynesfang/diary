// write.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: null,
    diary_date: "",
    input_diary_content: "",
    diary_type_array: ['未知', '工作', '学习', '生活', '娱乐', '旅游', '睡觉', '其它'],
    diary_content: [],
    send_status: true,
    current_edit_content_index: -1,
    edit_btn_text: "记"
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
    this.data.diary_content = [];
    this.data.current_edit_content_index = -1;
    var that = this;
    wx.getStorage({
      key: 'diary_date',
      success: function (res) {
        that.data.diary_date = res.data;
        that.setData({
          diary_date: res.data
        });
        wx.getStorage({
          key: that.data.diary_date,
          success: function (res) {
            that.data.diary_content = res.data;
            that.setData({
              diary_content: res.data
            });
          },
          complete: function (res) {
            that.add_new_diary_content();
          }
        });
      }
    });

  },
  save_diary: function () {
    wx.setStorage({
      key: this.data.diary_date,
      data: this.data.diary_content
    });
  },
  bindDiaryTypeChange: function (e) {
    var diary_content_index = e.currentTarget.dataset.idx;
    this.data.diary_content[diary_content_index].diary_type_index = e.detail.value;
    this.setData({
      diary_content: this.data.diary_content
    });
  },
  bindStartTimeChange: function (e) {
    var diary_content_index = e.currentTarget.dataset.idx;
    this.data.diary_content[diary_content_index].start_time = e.detail.value;
    this.setData({
      diary_content: this.data.diary_content
    });
  },
  costtimeChange: function (e) {
    var diary_content_index = e.currentTarget.dataset.idx;
    this.data.diary_content[diary_content_index].cost_time = e.detail.value
  },
  get_photo_operation: function(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['相 册', '拍 摄'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
            }
          });
        } else {
          that.diary_content_delete(e);
        }
      }
    });
  },
  diary_content_operation: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['编 辑', '删 除'],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.diary_content_edit(e);
        } else {
          that.diary_content_delete(e);
        }
      }
    });
  },
  diary_content_delete: function (e) {
    var cur_diary_content_index = e.currentTarget.dataset.idx;
    this.data.diary_content.splice(cur_diary_content_index, 1);
    for (var i = 0; i < this.data.diary_content.length; i++) {
      this.data.diary_content[i].diary_content_index = i;
    }
    this.setData({
      diary_content: this.data.diary_content
    });
  },
  diary_content_edit: function (e) {
    var cur_diary_content_index = e.currentTarget.dataset.idx;
    var diary_content = this.data.diary_content[cur_diary_content_index].content;
    this.setData({
      input_diary_content: diary_content,
      current_edit_content_index: cur_diary_content_index,
      send_status: false,
      edit_btn_text: "改"
    });
  },
  bindDiaryInput: function (e) {
    var cur_diary_content_index = this.data.current_edit_content_index;
    if (cur_diary_content_index == -1) {
      cur_diary_content_index = this.data.diary_content.length - 1;
    }
    this.data.diary_content[cur_diary_content_index].content = e.detail.value;
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
  add_new_diary_content: function () {
    if (this.data.current_edit_content_index == -1) {
      var current_diary_content_index = this.data.diary_content.length;
      var new_diary_content =
        {
          content: '',
          start_time: '--:--',
          cost_time: '0',
          diary_type: this.data.diary_type_array,
          diary_type_index: 0,
          diary_content_index: current_diary_content_index
        };
      this.data.diary_content.push(new_diary_content);
      this.setData({
        diary_content: this.data.diary_content,
        send_status: true,
        input_diary_content: ""
      });
    } else {
      this.setData({
        send_status: true,
        input_diary_content: "",
        edit_btn_text: "记"
      });
      this.data.current_edit_content_index = -1;
    }
  }
})