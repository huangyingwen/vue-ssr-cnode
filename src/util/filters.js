export function timeAgo(str) {
  var tiem = new Date(str)
  var between = new Date().getTime() - tiem.getTime() // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (between < 0) {
    return ''
  } else if (between / 1000 < 60) {
    return '刚刚'
  } else if (between / 60000 < 60) {
    return parseInt(between / 60000) + '分钟前'
  } else if (between / 3600000 < 24) {
    return parseInt(between / 3600000) + '小时前'
  } else if (between / 86400000 < 31) {
    return parseInt(between / 86400000) + '天前'
  } else if (between / 2592000000 < 12) {
    return parseInt(between / 2592000000) + '月前'
  } else {
    return parseInt(between / 31536000000) + '年前'
  }
}
