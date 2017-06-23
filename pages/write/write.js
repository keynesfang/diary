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
    current_edit_content_index: -1,
    edit_btn_text: "记",
    event_lock: false
  },
  onLoad: function (options) {
    util.showCurrentPage(this);
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    });
  },
  onShow: function () {
    this.data.diary_content = [];
    this.data.current_edit_content_index = -1;
    var that = this;
    wx.getStorage({
      key: 'diary_date',
      success: function (res) {
        that.data.diary_date = res.data;
        wx.getStorage({
          key: that.data.diary_date,
          success: function (res) {
            that.data.diary_content = res.data;
          },
          complete: function () {
            that.setData({
              diary_date: that.data.diary_date,
              diary_content: that.data.diary_content
            });
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
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1000
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
  diary_content_operation: function (e) {
    var diary_content_index = e.currentTarget.dataset.idx;
    var that = this;
    wx.showActionSheet({
      itemList: ['相 册', '编 辑', '删 除'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths;
              for (var imgIndex = 0; imgIndex < tempFilePaths.length; imgIndex++) {
                wx.saveFile({
                  tempFilePath: tempFilePaths[imgIndex],
                  success: function (res) {
                    that.data.diary_content[diary_content_index].image_list.push(res.savedFilePath);
                    that.setData({
                      diary_content: that.data.diary_content
                    });
                  }
                });
              }
            }
          });
        } else if (res.tapIndex == 1) {
          that.diary_content_edit(e);
        } else if (res.tapIndex == 1) {
          that.diary_content_delete(e);
        }
      }
    });
  },
  previewImage: function (e) {
    if (!this.data.event_lock) {
      var that = this;
      wx.previewImage({
        current: e.currentTarget.dataset.src,
        urls: that.data.diary_content[e.currentTarget.dataset.idx].image_list
      })
    } else {
      this.data.event_lock = false;
    }
  },
  deleteImage: function (e) {
    this.data.event_lock = true;
    var that = this;
    var cur_diary_content_index = e.currentTarget.dataset.idx;
    var imageUrl = e.currentTarget.dataset.src;
    var cur_image_index = this.data.diary_content[cur_diary_content_index].image_list.indexOf(imageUrl);
    wx.showModal({
      title: '提示',
      content: '确认删除选中图片吗？',
      success: function (res) {
        if (res.confirm) {
          that.data.diary_content[cur_diary_content_index].image_list.splice(cur_image_index, 1);
          that.setData({
            diary_content: that.data.diary_content
          });
        } else if (res.cancel) {
        }
      }
    })
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
    this.data.current_edit_content_index = cur_diary_content_index;
    this.setData({
      input_diary_content: diary_content,
      current_edit_content_index: cur_diary_content_index,
      edit_btn_text: "改"
    });
  },
  bindDiaryInput: function (e) {
    if (this.data.current_edit_content_index == -1) {
      var current_diary_content_index = this.data.diary_content.length;
      var new_diary_content =
        {
          content: '',
          start_time: '--:--',
          cost_time: '0',
          diary_type: this.data.diary_type_array,
          diary_type_index: 0,
          diary_content_index: current_diary_content_index,
          image_list: []
        };
      this.data.diary_content.push(new_diary_content);
      this.setData({
        diary_content: this.data.diary_content,
        input_diary_content: ""
      });
      this.data.current_edit_content_index = this.data.diary_content.length - 1;
    }
    var cur_diary_content_index = this.data.current_edit_content_index;

    this.data.diary_content[cur_diary_content_index].content = e.detail.value;
    this.setData({
      diary_content: this.data.diary_content,
      input_diary_content: e.detail.value
    });
  },
  add_new_diary_content: function () {
    this.data.current_edit_content_index = -1;
    this.setData({
      input_diary_content: "",
      edit_btn_text: "记"
    });
  }
})