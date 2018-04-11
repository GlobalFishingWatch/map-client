import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { COLORS } from 'config';

import colorPickerStyles from 'styles/components/shared/color-picker.scss';

class ColorPicker extends Component {
  renderInput(color) {
    return (
      <div className={classnames(colorPickerStyles.colorInput)} key={color}>
        <input
          type="radio"
          name={color}
          id={color}
          value={color}
          onChange={() => this.props.onColorChange(color)}
          checked={this.props.color === color}
        />
        <label htmlFor={color} style={{ backgroundColor: color }} />
      </div>
    );
  }
  render() {
    return (
      <div className={classnames(colorPickerStyles.colorPicker)}>
        <div className={colorPickerStyles.title}>Color</div>
        <div className={colorPickerStyles.colorInputs}>
          { Object.keys(COLORS).map(key => this.renderInput(COLORS[key]))}
        </div>
      </div>
    );
  }
}

ColorPicker.propTypes = {
  onColorChange: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default ColorPicker;
