import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconButton from 'src/components/Shared/IconButton';
import { PALETTE_COLORS, PALETTE_COLORS_LAYERS } from 'config';
import 'styles/components/map/layer-blending.scss';
import InputRange from 'react-input-range';
import colorPickerStyles from 'styles/components/shared/color-picker.scss';

class ColorPicker extends Component {
  renderInput(color, hue, checkedColor, id) {
    const key = `${id}-${color}`;
    return (
      <div className={colorPickerStyles.colorInput} key={key}>
        <input
          type="radio"
          name={key}
          id={key}
          value={color}
          onChange={() => this.props.onTintChange(color, hue)}
          checked={checkedColor.toLowerCase() === color.toLowerCase()}
        />
        <label htmlFor={key} style={{ backgroundColor: color }} />
      </div>
    );
  }
  render() {
    const { opacity, showLabels, onOpacityChange, onTintChange, onShowLabelsToggle, id, extendedPalette } = this.props;
    let checkedColor = this.props.color;
    if (checkedColor === undefined) {
      if (this.props.hue === undefined) {
        checkedColor = PALETTE_COLORS[0].color;
      } else {
        checkedColor = PALETTE_COLORS.find(color => color.hue === this.props.hue).color;
      }
    }

    let colors = (extendedPalette === true) ? PALETTE_COLORS : PALETTE_COLORS_LAYERS;
    if (extendedPalette !== true) {
      colors = colors.sort((tintA, tintB) => {
        if (extendedPalette === true) return 0;
        return tintA.hue - tintB.hue;
      });
    }


    return (
      <div className={colorPickerStyles.colorPicker}>
        {onTintChange && <div>
          <div className={colorPickerStyles.title}>Color:</div>
          <div className={colorPickerStyles.colorInputs}>
            {colors.map(tint => this.renderInput(tint.color, tint.hue, checkedColor, id))}
          </div>
        </div>}
        {onOpacityChange && <div className={colorPickerStyles.section}>
          Opacity:
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
        {onShowLabelsToggle && <div className={colorPickerStyles.section}>
          <div
            onClick={this.props.onShowLabelsToggle}
          >
            <IconButton
              icon="labels"
              activated={showLabels}
              label="Show labels"
            />
          </div>
        </div>}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  onTintChange: PropTypes.func,
  onOpacityChange: PropTypes.func,
  onShowLabelsToggle: PropTypes.func,
  color: PropTypes.string,
  hue: PropTypes.number,
  opacity: PropTypes.number,
  showLabels: PropTypes.bool,
  id: PropTypes.string,
  extendedPalette: PropTypes.bool
};

export default ColorPicker;
