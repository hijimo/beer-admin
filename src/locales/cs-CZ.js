import common from '@common/locales/cs-CZ/index';
import globalHeader from './cs-CZ/globalHeader';
import menu from './cs-CZ/menu';
import pwa from './cs-CZ/pwa';
import settingDrawer from './cs-CZ/settingDrawer';
import settings from './cs-CZ/settings';
import yeeorder from './cs-CZ/yeeorder';
import layout from './cs-CZ/layout';
import otherCommon from './cs-CZ/otherCommon';

export default {
  'navBar.lang': 'Czech',
  'layout.user.link.help': 'ajuda',
  'layout.user.link.privacy': 'política de privacidade',
  'layout.user.link.terms': 'termos de serviços',
  'app.preview.down.block': 'Download this page to your local project',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...yeeorder,
  ...common,
  ...layout,
  ...otherCommon,
};
