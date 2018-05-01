import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import checkboxStyles from 'styles/components/shared/checkbox.scss';

function Checkbox({ id, callback, label, labelClassNames, defaultChecked, checked, classNames, disabled, children }) {
  return (
    <div className={classnames([checkboxStyles.checkbox, classNames])}>
      <input type="checkbox" id={id} onChange={callback} defaultChecked={defaultChecked} checked={checked === true} disabled={disabled} />
      <label htmlFor={id} className={classnames([checkboxStyles.label, labelClassNames])}>
        {label}
        {children}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  label: PropTypes.string,
  labelClassNames: PropTypes.string,
  classNames: PropTypes.string,
  children: PropTypes.node
};

export default Checkbox;
