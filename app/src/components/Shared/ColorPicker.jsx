import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { COLORS } from 'config';

import colorPickerStyles from 'styles/components/shared/color-picker.scss';

class ExpandButton extends Component {
  onColorChange(e) {
    this.props.onColorChange(e.target.value);
  }

  renderInput(color, i) {
    return (
      <div className={colorPickerStyles.colorInput} key={i}>
        <input
          type="radio"
          name="color"
          id={color}
          value={color}
          onChange={e => this.onColorChange(e)}
          checked={this.props.color === color}
        />
        <label htmlFor={color} className={colorPickerStyles[color]} />
      </div>
    );
  }
  render() {
    return (
      <div className={colorPickerStyles.colorPicker}>
        <div className={colorPickerStyles.title}>Color</div>
        { Object.keys(COLORS).map((color, i) => this.renderInput(color, i))}
      </div>
    );
  }
}

ExpandButton.propTypes = {
  onColorChange: PropTypes.func.isRequired,
  color: PropTypes.string
};

export default ExpandButton;
