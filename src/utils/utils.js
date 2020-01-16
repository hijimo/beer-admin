import { parse } from 'querystring';
import { formatMessage } from 'umi-plugin-react/locale';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const lenErrMessage = ({ min, max }) => {
  let message = '';
  if (min && max) {
    message = `
      ${formatMessage({ id: 'yeeorder.must-be-between' })} 
      ${min}
      ${formatMessage({ id: 'yeeorder.and' })}
      ${max}
      ${formatMessage({ id: 'yeeorder.characters' })}
    `;
  } else if (min && !max) {
    message = `
      ${formatMessage({ id: 'yeeorder.must-be-at-least' })} 
      ${min}  
      ${formatMessage({ id: 'yeeorder.characters' })}
    `;
  } else if (!min && max) {
    message = `
      ${formatMessage({ id: 'yeeorder.cannot-be-longer-than' })} 
      ${max}  
      ${formatMessage({ id: 'yeeorder.characters' })}
    `;
  }
  return message;
};

export const pswValidator = (rule, str, callback) => {
  try {
    let isPwd = false;
    if (str.length < 8 || str.length > 16) {
      isPwd = false;
    } else {
      const hasChinese = /[\u4E00-\u9FA5\uF900-\uFA2D]+/.test(str);
      const hasNum = /[0-9]+/.test(str);
      const hasCChar = /[a-z]+/.test(str); // 包含小写
      const hasLChar = /[A-Z]+/.test(str); // 包含大写
      const hasSpace = /\s+/.test(str); // 包含空格
      const hasSign = /\W+/.test(str) && /\D+/.test(str); // 特殊字符
      if (hasChinese || hasSpace) {
        isPwd = false;
      } else {
        isPwd = (hasNum ? 1 : 0) + (hasCChar ? 1 : 0) + (hasLChar ? 1 : 0) + (hasSign ? 1 : 0) >= 2;
      }
    }
    if (isPwd) {
      callback();
    } else {
      callback(
        `
          8-16
          ${formatMessage({ id: 'yeeorder.characters' })},
          ${formatMessage({ id: 'yeeorder.Must-contain-two-different-types-of-characters' })},
        `,
      );
    }
  } catch (err) {
    callback(err);
  }
};

export const specialCharValidator = (rule, str, callback) => {
  try {
    const hasSign = /\W+/.test(str) && /\D+/.test(str);
    const hasChinese = /^[\u4E00-\u9FA5]*$/.test(str);
    if (hasSign || hasChinese) {
      callback(formatMessage({ id: 'yeeorder.invalid-format' }));
    } else {
      callback();
    }
  } catch (err) {
    callback(err);
  }
};
