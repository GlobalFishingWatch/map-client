import PropTypes from 'prop-types';
import React from 'preact';
import classnames from 'classnames';
import LoaderStyles from 'styles/components/loader.scss';

export default function Loader(props) {
  const { visible, absolute, tiny } = props;
  const loader = (
    <div
      className={classnames([LoaderStyles.loader, {
        [LoaderStyles._absolute]: absolute,
        [LoaderStyles._tiny]: tiny
      }])}
    >
      <div className={LoaderStyles.loaderContainer}>
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
      </div>
    </div>
  );
  return visible ? loader : false;
}

Loader.propTypes = {
  visible: PropTypes.bool,
  absolute: PropTypes.bool
};
