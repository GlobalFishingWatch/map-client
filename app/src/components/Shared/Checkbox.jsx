import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import 'styles/components/shared/checkbox.scss';

function Checkbox({ id, callback, label, defaultChecked, checked, classNames, disabled }) {
  return (
    <div className={classnames(['c-checkbox', classNames])}>
      <div className="checkbox">
        { typeof checked !== 'undefined' ?
          <input type="checkbox" id={id} onChange={callback} defaultChecked={defaultChecked} checked={checked} disabled={disabled} />
          :
          <input type="checkbox" id={id} onChange={callback} defaultChecked={defaultChecked} disabled={disabled} />
        }
        <label htmlFor={id} />
      </div>
      <div className="label">{label}</div>
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
  classNames: PropTypes.string
};

export default Checkbox;
