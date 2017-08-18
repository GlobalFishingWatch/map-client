import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import classnames from 'classnames';
import InputRange from 'react-input-range';
import { VESSELS_HUES_INCREMENT } from 'config';
import icons from 'styles/icons.scss';
import BlendingStyles from 'styles/components/map/layer-blending.scss';
import BlendingIcon from '-!babel-loader!svg-react-loader!assets/icons/blending-icon.svg?name=BlendingIcon';

const INPUT_RANGE_DEFAULT_CONFIG = {
  classnames: {
    inputRange: 'blendingRange',
    maxLabel: 'label _max',
    minLabel: 'label _min',
    valueLabel: 'label _current',
    activeTrack: 'trackActive',
    track: 'trackContainer',
    sliderContainer: 'thumbContainer',
    slider: 'thumb'
  }
};

class PinnedVesselOptionsTooltip extends Component {

  constructor(props) {
    super(props);

    this.hueRangeConfig = cloneDeep(INPUT_RANGE_DEFAULT_CONFIG);
    assign(this.hueRangeConfig, {
      minValue: 0,
      maxValue: 360,
      step: VESSELS_HUES_INCREMENT,
      value: this.props.hueValue
    });

    this.hueRangeConfig.classnames.inputRange = 'blendingRange _hue';

    this.closeTooltip = this.closeTooltip.bind(this);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        window.addEventListener('touchend', this.closeTooltip);
        window.addEventListener('click', this.closeTooltip);
      } else {
        window.removeEventListener('touchend', this.closeTooltip);
        window.removeEventListener('click', this.closeTooltip);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('touchend', this.closeTooltip);
    window.removeEventListener('click', this.closeTooltip);
  }

  closeTooltip(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.tooltip.contains(e.target) || !this.props.visible) return;
    this.props.toggleVisibility();
  }

  onChangeHue(value) {
    this.props.onChangeHue(value);
  }

  render() {
    return (
      <div
        className={classnames(BlendingStyles.blending)}
        ref={(ref) => { this.tooltip = ref; }}
      >
        <BlendingIcon
          onClick={() => this.props.toggleVisibility()}
          className={classnames(icons.blendingIcon,
            { [icons._white]: this.props.visible })}
        />
        {this.props.visible &&
        <div
          className={classnames(
            BlendingStyles.blendingTooltip,
            { [BlendingStyles._reverse]: this.props.isReverse })
          }
        >
          <div>
            Hue
            <InputRange
              classNames={this.hueRangeConfig.classnames}
              value={this.props.hueValue}
              maxValue={this.hueRangeConfig.maxValue}
              minValue={this.hueRangeConfig.minValue}
              onChange={value => this.onChangeHue(value)}
              step={this.hueRangeConfig.step}
            />
          </div>
        </div>}
      </div>
    );
  }
}

PinnedVesselOptionsTooltip.propTypes = {
  displayOpacity: PropTypes.bool,
  hueValue: PropTypes.number,
  opacityValue: PropTypes.number,
  onChangeHue: PropTypes.func,
  isReverse: PropTypes.bool,
  toggleVisibility: PropTypes.func,
  visible: PropTypes.bool
};

export default PinnedVesselOptionsTooltip;
