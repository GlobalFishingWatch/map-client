import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ExpandItemStyles from 'styles/components/shared/expand-item.scss';
import { VelocityTransitionGroup } from 'velocity-react';

function ExpandItem({ active, children, accordion, isVesselInfoPanelOpen }) {
  return (
    <div>
      <div
        className={classnames(
          ExpandItemStyles.expandItem,
          { [ExpandItemStyles.isVesselInfoPanelOpen]: isVesselInfoPanelOpen }
        )}
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
  children: PropTypes.node.isRequired,
  isVesselInfoPanelOpen: PropTypes.bool
};

export default ExpandItem;
