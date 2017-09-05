import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import ExpandItemButtonStyles from 'styles/components/shared/expand-item-button.scss';

function ExpandItemButton({ children, active }) {
  return (
    <div className={classnames(ExpandItemButtonStyles.expandItemButton, { [ExpandItemButtonStyles.active]: active })}>
      <button>
        {children}
      </button>
    </div>
  );
}

ExpandItemButton.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool
};

export default ExpandItemButton;
