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
    event_lock: false,
    rollback_list: []
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
            that.update_data_for_UI();
          }
        });
      }
    });
  },
  update_data_for_UI: function() {
    var data_obj = {
      diary_date: this.data.diary_date,
      input_diary_content: this.data.input_diary_content,
      diary_content: this.data.diary_content,
      current_edit_content_index: this.data.current_edit_content_index
    }
    this.setData(data_obj);
    this.data.rollback_list.push(data_obj);
  },
  rollback_data_for_UI: function() {
    var rollback_list_length = this.data.rollback_list.length;
    if (rollback_list_length > 1) {
      var cur_data = this.data.rollback_list.pop();
      var prev_data = this.data.diary_content[rollback_list_length-2];
      this.setData(prev_data);
    }
  },
  save_diary: function () {
    var that = this;
    wx.setStorage({
      key: this.data.diary_date,
      data: this.data.diary_content
    });
  },
  bindDiaryTypeChange: function (e) {
    this.data.current_edit_content_index = e.currentTarget.dataset.idx;
    this.data.diary_content[this.data.current_edit_content_index].diary_type_index = e.detail.value;
    this.update_data_for_UI();
  },
  bindStartTimeChange: function (e) {
    this.data.current_edit_content_index = e.currentTarget.dataset.idx;
    this.data.diary_content[this.data.current_edit_content_index].start_time = e.detail.value;
    this.update_data_for_UI();
  },
  costtimeChange: function (e) {
    this.data.current_edit_content_index = e.currentTarget.dataset.idx;
    this.data.diary_content[this.data.current_edit_content_index].cost_time = e.detail.value
  },
  set_content_background_color: function(color_value) {
    if (this.data.current_edit_content_index != -1) {
      this.data.diary_content[this.data.current_edit_content_index].bgcolor = color_value;
    }
  },
  diary_content_operation: function (e) {
    this.data.current_edit_content_index = e.currentTarget.dataset.idx;
    this.set_content_background_color("#FFCC99");
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
                    that.data.diary_content[that.data.current_edit_content_index].image_list.push(res.savedFilePath);
                    that.update_data_for_UI();
                  },
                  fail: function(res) {
                    wx.showModal({
                      title: '错误提示',
                      content: '文件大小超过上限，无法显示。',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        }
                      }
                    });
                  }
                });
              }
            }
          });
        } else if (res.tapIndex == 1) {
          that.diary_content_edit(e);
          that.update_data_for_UI();
        } else if (res.tapIndex == 2) {
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
    this.data.current_edit_content_index = e.currentTarget.dataset.idx;
    var imageUrl = e.currentTarget.dataset.src;
    var cur_image_index = this.data.diary_content[this.data.current_edit_content_index].image_list.indexOf(imageUrl);
    wx.showModal({
      title: '提示',
      content: '确认删除选中图片吗？',
      success: function (res) {
        if (res.confirm) {
          that.data.diary_content[that.data.current_edit_content_index].image_list.splice(cur_image_index, 1);
        } else if (res.cancel) {
        }
        that.update_data_for_UI();
      }
    })
  },
  diary_content_delete: function (e) {
    this.data.current_edit_content_index = e.currentTarget.dataset.idx;
    this.data.diary_content.splice(this.data.current_edit_content_index, 1);
    for (var i = 0; i < this.data.diary_content.length; i++) {
      this.data.diary_content[i].diary_content_index = i;
    }
  },
  diary_content_edit: function (e) {
    this.data.current_edit_content_index = e.currentTarget.dataset.idx;
    this.data.input_diary_content = this.data.diary_content[this.data.current_edit_content_index].content;
    this.data.current_edit_content_index = this.data.current_edit_content_index;
  },
  bindDiaryInput: function (e) {
    if (this.data.current_edit_content_index == -1) {
      this.data.current_edit_content_index = this.data.diary_content.length;
      var new_diary_content =
        {
          content: '',
          start_time: '--:--',
          cost_time: '0',
          diary_type: this.data.diary_type_array,
          diary_type_index: 0,
          diary_content_index: this.data.current_edit_content_index,
          image_list: [],
          bgcolor: "#FFCC99"
        };
      this.data.diary_content.push(new_diary_content);
      this.data.input_diary_content = "";
      this.data.current_edit_content_index = this.data.diary_content.length - 1;
      this.update_data_for_UI();
    }

    this.data.diary_content[this.data.current_edit_content_index].content = e.detail.value;
    this.data.input_diary_content = e.detail.value;
    this.update_data_for_UI();
  },
  save_new_diary_content: function () {
    var diary_length = this.data.diary_content.length;
    for (var i = 0; i < diary_length; i++) {
      this.data.diary_content[i].bgcolor = "#F8F8F8";
    }
    this.data.current_edit_content_index = -1;
    this.data.input_diary_content = "";
    this.update_data_for_UI();
    this.save_diary();
  }
});