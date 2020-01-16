import { formatMessage } from 'umi-plugin-react/locale';

export const blankCheck = (rule, value, callback) => {
  try {
    if (value && !value.trim()) {
      callback(`${formatMessage({ id: 'yeeorder.regexp.blank-check.msg' })}`);
    } else {
      callback();
    }
  } catch (err) {
    callback(err);
  }
};
