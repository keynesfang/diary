// diary.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: null,
    animation_page: {},
    // hasEmptyGrid 变量控制是否渲染空格子，若当月第一天是星期天，就不应该渲染空格子
    hasEmptyGrid: false 
  },
  onShow: function () {
    util.showCurrentPage(this);
  },
  onLoad(options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    this.show_today();
  },
  start_write() {
    util.gotoOtherPage(this, "/pages/write/write");
  },
  show_today() {
    const date = new Date();
    var cur_year = date.getFullYear();
    var cur_month = date.getMonth() + 1;
    var cur_day = date.getDate();
    const today = "" + cur_year + cur_month + cur_day;
    const diary_day = cur_year + "/" + cur_month + "/" + cur_day;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    wx.setStorage({
      key: "diary_date",
      data: diary_day
    });
    this.setData({
      cur_year,
      cur_month,
      cur_day,
      today,
      diary_day,
      weeks_ch
    })
  },
  select_diary_day(e) {
    var cur_year = this.data.cur_year;
    var cur_month = this.data.cur_month;
    var cur_day = e.currentTarget.dataset.day;
    const diary_day = cur_year + "/" + cur_month + "/" + cur_day;
    const today = "" + cur_year + cur_month + cur_day;
    wx.setStorage({
      key: "diary_date",
      data: diary_day
    });
    this.setData({
      diary_day,
      today
    })
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  }
})