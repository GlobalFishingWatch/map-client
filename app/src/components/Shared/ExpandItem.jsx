import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ExpandItemStyles from 'styles/components/shared/expand-item.scss';
import { VelocityTransitionGroup } from 'velocity-react';

function ExpandItem({ active, children, arrowPosition, carousel }) {
  return (
    <div
      className={classnames(ExpandItemStyles.expandItem)}
    >
      <VelocityTransitionGroup
        enter={{ animation: 'slideDown', duration: 200, easing: 'easeOutCubic' }}
        leave={{ animation: 'slideUp', duration: 200, easing: 'easeOutCubic' }}
      >
        {active && <div
          className={classnames({
            [ExpandItemStyles.notCarousel]: !carousel,
            [ExpandItemStyles.firstIcon]: arrowPosition === 0,
            [ExpandItemStyles.secondIcon]: arrowPosition === 1
          })}
        >
          {children}
        </div>
        }
      </VelocityTransitionGroup>
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
