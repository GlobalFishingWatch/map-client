import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import NotificationStyles from './notifications.scss';

const Notifications = ({ type, content, onCloseClick }) => (
  <div className={cx(NotificationStyles.banner, NotificationStyles[type])}>
    <span dangerouslySetInnerHTML={{ __html: content }} />
    <button className={NotificationStyles.closeButton} onClick={() => onCloseClick()}>
      <span className={NotificationStyles.icon}>✕</span>
    </button>
  </div>
);

Notifications.propTypes = {
  type: PropTypes.oneOf(['notification', 'warning', 'error']),
  content: PropTypes.string,
  onCloseClick: PropTypes.func.isRequired
};

Notifications.defaultProps = {
  content: null
};

export default Notifications;
