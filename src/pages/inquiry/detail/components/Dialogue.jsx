import React, { Component } from 'react';
import { List, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'dva';
import MessageInput from './MessageInput';
import Message from './Message';
import styles from '../index.less';

@connect(({ inquiry, loading }) => ({
  dialogue: inquiry.dialogue,
  pageLoading: loading.effects['inquiry/fetchDialogue'],
}))
class Dialogue extends Component {
  componentDidMount() {
    this.fetchDialogue();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inquiry/clearDialogue',
    });
  }

  fetchDialogue = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const { dispatch, contactId } = this.props;
    dispatch({
      type: 'inquiry/fetchDialogue',
      payload: {
        contactId,
        ...pageInfo,
      },
    });
  };

  handleInfiniteOnLoad = () => {
    const { dialogue, pageLoading } = this.props;
    const {
      pagination: { pageNo, pageSize, total },
    } = dialogue;
    const hasMore = Math.ceil(total / pageSize) > pageNo;
    if (hasMore && !pageLoading) {
      this.fetchDialogue({
        pageNo: pageNo + 1,
        pageSize,
      });
    }
  };

  reloadMessage = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'inquiry/clearDialogue' });
    this.fetchDialogue();
  };

  render() {
    const { dialogue, pageLoading, contactId, inquiryType } = this.props;
    const {
      pagination: { pageNo, pageSize, total },
      list,
    } = dialogue;
    const hasMore = Math.ceil(total / pageSize) > pageNo;
    return (
      <div className={styles.wrapper}>
        <MessageInput contactId={contactId} reloadMessage={this.reloadMessage} total={total} />
        <div className={styles['demo-infinite-container']}>
          <InfiniteScroll
            className={styles.infiniteScroll}
            initialLoad={false}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!pageLoading && hasMore}
            useWindow={false}
          >
            <List
              dataSource={list}
              renderItem={item => <Message inquiryType={inquiryType} item={item} key={item.id} />}
            >
              {pageLoading && hasMore && (
                <div className={styles['demo-loading-container']}>
                  <Spin />
                </div>
              )}
            </List>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default Dialogue;
