module.exports = (date) => {
  var date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return {
    y: year,
    M: month,
    d: day,
    H: hour,
    m: minute,
    s: second
  }
}
