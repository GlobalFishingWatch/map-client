import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ExpandItemStyles from 'styles/components/shared/expand-item.scss';
import { VelocityTransitionGroup } from 'velocity-react';

function ExpandItem({ active, children, accordion }) {
  return (
    <div className={ExpandItemStyles._mobileScroll}>
      <div
        className={classnames(ExpandItemStyles.expandItem)}
      >
        <VelocityTransitionGroup
          enter={{ animation: 'slideDown', duration: 200, easing: 'easeOutCubic' }}
          leave={{ animation: 'slideUp', duration: 200, easing: 'easeOutCubic' }}
        >
          {active && <div
            className={classnames({
              [ExpandItemStyles.notAccordion]: !accordion
            })}
          >
            {children}
          </div>
          }
        </VelocityTransitionGroup>
      </div>
    </div>
  );
}

ExpandItem.propTypes = {
  active: PropTypes.bool.isRequired,
  accordion: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default ExpandItem;
