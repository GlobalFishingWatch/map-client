import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { COLORS } from 'config';
import 'styles/components/map/layer-blending.scss';
import InputRange from 'react-input-range';
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
    const { opacity, onOpacityChange } = this.props;
    return (
      <div className={colorPickerStyles.colorPicker}>
        <div className={colorPickerStyles.title}>Color</div>
        <div className={colorPickerStyles.colorInputs}>
          { Object.keys(COLORS).map(key => this.renderInput(COLORS[key]))}
        </div>
        {onOpacityChange && <div className={colorPickerStyles.section}>
          Opacity
          <InputRange
            value={opacity}
            maxValue={1}
            minValue={0}
            step={0.01}
            onChange={value => onOpacityChange(value)}
            classNames={{
              inputRange: 'blendingRange',
              maxLabel: 'label',
              minLabel: 'label',
              valueLabel: 'label',
              activeTrack: 'trackActive',
              track: 'trackContainer',
              sliderContainer: 'thumbContainer',
              slider: 'thumb'
            }}
          />
        </div>}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  onColorChange: PropTypes.func.isRequired,
  onOpacityChange: PropTypes.func,
  color: PropTypes.string.isRequired,
  opacity: PropTypes.number
};

export default ColorPicker;
