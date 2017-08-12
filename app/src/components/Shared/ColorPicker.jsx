import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { COLORS } from 'constants';

import colorPickerStyles from 'styles/components/shared/color-picker.scss';

class ExpandButton extends Component {
  onColorChange(e) {
    this.props.onColorChange(e.target.value);
  }

  renderInput(color, i) {
    return (
      <div className={classnames(colorPickerStyles.colorInput)} key={i}>
        <input
          type="radio"
          name="color"
          id={color}
          value={color}
          onClick={e => this.onColorChange(e)}
          checked={this.props.color === color}
        />
        <label htmlFor={color} className={classnames(colorPickerStyles[color])} />
      </div>
    );
  }
  render() {
    return (
      <div className={classnames(colorPickerStyles.colorPicker)}>
        <div>Color</div>
        { Object.keys(COLORS).map((color, i) => this.renderInput(color, i))}
      </div>
    );
  }
}

ExpandButton.propTypes = {
  onColorChange: PropTypes.func.isRequired,
  color: PropTypes.func
};

export default ExpandButton;
