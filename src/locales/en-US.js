import common from '@common/locales/en-US/index';
import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import yeeorder from './en-US/yeeorder';
import uploadList from './en-US/uploadList';
import layout from './en-US/layout';
import otherCommon from './en-US/otherCommon';

export default {
  'navBar.lang': 'English',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...yeeorder,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...uploadList,
  ...common,
  ...component,
  ...layout,
  ...otherCommon,
};
