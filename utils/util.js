function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function gotoOtherPage(that, url) {
  wx.showLoading({
    title: "加载中"
  });
  var animation_goto = wx.createAnimation({
    duration: 1000,
    timingFunction: 'linear',
  })
  animation_goto.opacity(0).step()
  that.setData({
    animation_page: animation_goto.export()
  })
  setTimeout(function () {
    wx.navigateTo({
      url: url,
    })
  }.bind(that), 1000)
}

function showCurrentPage(that) {
  var animation_show = wx.createAnimation({
    timingFunction: 'linear',
  })
  animation_show.opacity(1).step()
  that.setData({
    animation_page: animation_show.export()
  })
}

module.exports = {
  formatTime: formatTime,
  gotoOtherPage: gotoOtherPage,
  showCurrentPage: showCurrentPage
}
