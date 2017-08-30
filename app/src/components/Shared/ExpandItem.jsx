import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ExpandItemStyles from 'styles/components/shared/expand-item.scss';

function ExpandItem({ active, children, arrowPosition, carousel }) {
  return (
    <div
      className={classnames(ExpandItemStyles.expandItem)}
    >
      <div
        className={classnames({
          [ExpandItemStyles.opened]: active === true,
          [ExpandItemStyles.closed]: active === false,
          [ExpandItemStyles.notCarousel]: !carousel,
          [ExpandItemStyles.firstIcon]: arrowPosition === 0,
          [ExpandItemStyles.secondIcon]: arrowPosition === 1
        })}
      >
        {children}
      </div>
    </div>
  );
}

ExpandItem.propTypes = {
  active: PropTypes.bool.isRequired,
  carousel: PropTypes.bool,
  children: PropTypes.node.isRequired,
  arrowPosition: PropTypes.number
};

export default ExpandItem;
