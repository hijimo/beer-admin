import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import useMenu from '@common/hooks/useMenu';
import config from '@common/config';
import GlobalFooter from '@common/components/GlobalFooter/GlobalFooter';
import ErrorPage from '@common/components/500';
// import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/logo.png';
import styles from './BasicLayout.less';

const { mallHost } = config;

// const menuDataRender = menuList =>
//   menuList.map(item => {
//     const localItem = {
//       ...item,
//       children: item.children ? menuDataRender(item.children) : [],
//     };
//     return Authorized.check(item.authority, localItem, null);
//   });

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    location: { pathname },
  } = props;

  const { flattenMenuData, menuDataRender, isLoading, isError } = useMenu();

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);

  // 页面路径改变时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const renderChildren = () => {
    if (isLoading) {
      return null;
    }
    if (isError) {
      return <ErrorPage />;
    }
    return children;
  };

  return (
    <ProLayout
      menuHeaderRender={() => (
        <a href={mallHost}>
          <img src={logo} alt='logo' />
        </a>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => routers}
      itemRender={route => <span>{route.breadcrumbName}</span>}
      footerRender={() => <GlobalFooter className={styles.footer} />}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
      flattenMenuData={flattenMenuData}
    >
      {renderChildren()}
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
