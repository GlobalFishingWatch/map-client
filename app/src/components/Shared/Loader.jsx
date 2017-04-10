import React from 'react';
import classnames from 'classnames';
import loaderStyle from 'styles/components/c-loader.scss';

export default function Loader(props) {
  const { visible, absolute, tiny } = props;
  const loader = (
    <div
      className={classnames([loaderStyle['c-loader'], {
        [loaderStyle['-absolute']]: absolute,
        [loaderStyle['-tiny']]: tiny
      }])}
    >
      <div className={loaderStyle['loader-container']}>
        <div className={loaderStyle['loader-bubble']} />
        <div className={loaderStyle['loader-bubble']} />
        <div className={loaderStyle['loader-bubble']} />
        <div className={loaderStyle['loader-bubble']} />
        <div className={loaderStyle['loader-bubble']} />
        <div className={loaderStyle['loader-bubble']} />
        <div className={loaderStyle['loader-bubble']} />
        <div className={loaderStyle['loader-bubble']} />
      </div>
    </div>
  );
  return visible ? loader : false;
}

Loader.propTypes = {
  visible: React.PropTypes.bool,
  absolute: React.PropTypes.bool
};
