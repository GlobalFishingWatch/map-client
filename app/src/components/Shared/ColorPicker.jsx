import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { PALETTE_COLORS } from 'config';
import 'styles/components/map/layer-blending.scss';
import InputRange from 'react-input-range';
import colorPickerStyles from 'styles/components/shared/color-picker.scss';

class ColorPicker extends Component {
  renderInput(color, hue, checkedColor) {
    return (
      <div className={classnames(colorPickerStyles.colorInput)} key={color}>
        <input
          type="radio"
          name={color}
          id={color}
          value={color}
          onChange={() => this.props.onTintChange(color, hue)}
          checked={checkedColor.toLowerCase() === color.toLowerCase()}
        />
        <label htmlFor={color} style={{ backgroundColor: color }} />
      </div>
    );
  }
  render() {
    const { opacity, onOpacityChange } = this.props;
    const checkedColor = this.props.color || PALETTE_COLORS.find(color => color.hue === this.props.hue).color;
    return (
      <div className={colorPickerStyles.colorPicker}>
        <div className={colorPickerStyles.title}>Color</div>
        <div className={colorPickerStyles.colorInputs}>
          { PALETTE_COLORS.map(tint => this.renderInput(tint.color, tint.hue, checkedColor))}
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
  onTintChange: PropTypes.func,
  onOpacityChange: PropTypes.func,
  color: PropTypes.string,
  hue: PropTypes.number,
  opacity: PropTypes.number
};

export default ColorPicker;
