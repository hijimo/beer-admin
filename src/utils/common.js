// 验证是否含有中文
export const hasChineseReg = /^[^\u4e00-\u9fa5]+$/;
// 邮箱验证
export const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
// 邮箱手机
export const mobileReg = /^1[3|5|6|7|8|9]\d{9}$/;
// 验证url
export const urlReg = /^((https?|ftp|file):\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/;
