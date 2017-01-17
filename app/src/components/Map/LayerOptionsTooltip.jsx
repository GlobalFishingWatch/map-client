import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import InputRange from 'react-input-range';
import { VESSELS_HUES_INCREMENT } from 'constants';

import BlendingStyles from 'styles/components/map/c-layer-blending.scss';

const INPUT_RANGE_DEFAULT_CONFIG = {
  classnames: {
    component: 'blending-range',
    labelMax: 'label -max',
    labelMin: 'label -min',
    labelValue: 'label -current',
    trackActive: 'track-active',
    trackContainer: 'track-container',
    sliderContainer: 'thumb-container',
    slider: 'thumb'
  }
};

class LayerOptionsTooltip extends Component {

  constructor(props) {
    super(props);

    this.opacityRangeConfig = _.cloneDeep(INPUT_RANGE_DEFAULT_CONFIG);
    _.assign(this.opacityRangeConfig, {
      minValue: 10,
      maxValue: 100,
      step: 1,
      value: this.props.opacityValue * 100
    });

    this.hueRangeConfig = _.cloneDeep(INPUT_RANGE_DEFAULT_CONFIG);
    _.assign(this.hueRangeConfig, {
      minValue: 0,
      maxValue: 360,
      step: VESSELS_HUES_INCREMENT,
      value: this.props.hueValue
    });

    this.hueRangeConfig.classnames.component = 'blending-range -hue';

    this.state = {
      opacityRangeValue: this.opacityRangeConfig.value,
      hueRangeValue: this.hueRangeConfig.value
    };
  }

  onChangeOpacity(value) {
    const transparency = parseFloat(value) / 100;
    this.setState({
      opacityRangeValue: value
    });

    this.props.onChangeOpacity(transparency);
  }

  onChangeHue(value) {
    this.setState({
      hueRangeValue: value
    });

    this.props.onChangeHue(value);
  }

  render() {
    // if (!this.state.opacityRangeValue) return null;

    return (
      <div
        className={classnames(BlendingStyles['c-blending'], { [`${BlendingStyles['-is-visible']}`]: this.props.showBlending })}
      >
        {this.props.displayOpacity && <div>
          Opacity
          <InputRange
            classNames={this.opacityRangeConfig.classnames}
            value={this.state.opacityRangeValue}
            maxValue={this.opacityRangeConfig.maxValue}
            minValue={this.opacityRangeConfig.minValue}
            onChange={(component, value) => this.onChangeOpacity(value)}
            step={this.opacityRangeConfig.step}
          />
        </div>}
        {this.props.displayHue && <div>
          Hue
          <InputRange
            classNames={this.hueRangeConfig.classnames}
            value={this.state.hueRangeValue}
            maxValue={this.hueRangeConfig.maxValue}
            minValue={this.hueRangeConfig.minValue}
            onChange={(component, value) => this.onChangeHue(value)}
            step={this.hueRangeConfig.step}
          />
        </div>}
      </div>
    );
  }
}

LayerOptionsTooltip.propTypes = {
  displayHue: React.PropTypes.bool,
  displayOpacity: React.PropTypes.bool,
  hueValue: React.PropTypes.number,
  onChangeHue: React.PropTypes.func,
  onChangeOpacity: React.PropTypes.func,
  opacityValue: React.PropTypes.number,
  showBlending: React.PropTypes.bool
};

export default LayerOptionsTooltip;
