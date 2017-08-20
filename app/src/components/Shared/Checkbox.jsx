import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import 'styles/components/shared/checkbox.scss';

function Checkbox({ id, callback, label, labelClassNames, defaultChecked, checked, classNames, disabled }) {
  return (
    <div className={classnames(['c-checkbox', classNames])}>
      <div className="checkbox">
        <input type="checkbox" id={id} onChange={callback} defaultChecked={defaultChecked} checked={checked === true} disabled={disabled} />
        <label htmlFor={id} />
      </div>
      <div className={classnames(['label', labelClassNames])}>{label}</div>
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
  classNames: PropTypes.string
};

export default Checkbox;
