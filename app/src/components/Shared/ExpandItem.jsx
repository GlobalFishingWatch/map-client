import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ExpandItemStyles from 'styles/components/shared/expand-item.scss';

function ExpandItem({ active, children, iconPosition }) {
  return (
    <div
      className={classnames(ExpandItemStyles.expandItem)}
    >
      <div
        className={classnames({
          [ExpandItemStyles.opened]: active === true,
          [ExpandItemStyles.closed]: active === false,
          [ExpandItemStyles.firstIcon]: iconPosition === 0,
          [ExpandItemStyles.secondIcon]: iconPosition === 1
        })}
      >
        {children}
      </div>
    </div>
  );
}

ExpandItem.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  iconPosition: PropTypes.number.isRequired
};

export default ExpandItem;
