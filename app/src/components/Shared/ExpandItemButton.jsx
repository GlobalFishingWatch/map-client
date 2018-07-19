import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import ExpandItemButtonStyles from 'styles/components/shared/expand-item-button.scss';

function ExpandItemButton({ children, active, expandable, label }) {
  const _expandable = (expandable === undefined) ? true : expandable;
  return (
    <div
      className={classnames(
        ExpandItemButtonStyles.expandItemButton,
        {
          [ExpandItemButtonStyles._active]: active,
          [ExpandItemButtonStyles._expandable]: _expandable
        })}
    >
      <button>
        {children}
      </button>
      <span className={ExpandItemButtonStyles.label}>
        {label}
      </span>
    </div>
  );
}

ExpandItemButton.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  expandable: PropTypes.bool
};

export default ExpandItemButton;
