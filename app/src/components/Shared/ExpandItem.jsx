import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ExpandItemStyles from 'styles/components/shared/expand-item.scss';

function ExpandItem({ active, children }) {
  return (
    <div className={classnames(ExpandItemStyles.expandItem)}>
      <div
        className={classnames({
          [ExpandItemStyles.opened]: active === true,
          [ExpandItemStyles.closed]: active === false
        })}
      >
        {children}
      </div>
    </div>
  );
}

ExpandItem.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

export default ExpandItem;
