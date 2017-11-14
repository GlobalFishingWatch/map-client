import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { COLORS } from 'config';

import colorPickerStyles from 'styles/components/shared/color-picker.scss';

class ColorPicker extends Component {
  onColorChange(e) {
    this.props.onColorChange(e.target.value);
  }

  renderInput(color, key) {
    const id = `${key}${color}`;
    return (
      <div className={classnames(colorPickerStyles.colorInput)} key={key}>
        <input
          type="radio"
          name={id}
          id={id}
          value={color}
          onChange={e => this.onColorChange(e)}
          checked={this.props.color === color}
        />
        <label htmlFor={id} className={classnames(colorPickerStyles[color])} />
      </div>
    );
  }
  render() {
    return (
      <div className={classnames(colorPickerStyles.colorPicker)}>
        <div className={colorPickerStyles.title}>Color</div>
        <div className={colorPickerStyles.colorInputs}>
          { Object.keys(COLORS).map((color, i) => this.renderInput(color, `${i}${this.props.id}`))}
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
