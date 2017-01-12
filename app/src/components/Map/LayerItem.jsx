import _ from 'lodash';
import React, { Component } from 'react';
import classnames from 'classnames';
import InputRange from 'react-input-range';
import { LAYER_TYPES, VESSELS_HUES_INCREMENT } from 'constants';
import { hueToRgbString } from 'util/hsvToRgb';
import LayerListStyles from 'styles/components/map/c-layer-list.scss';
import SwitcherStyles from 'styles/components/shared/c-switcher.scss';
import BlendingStyles from 'styles/components/map/c-layer-blending.scss';
import ReportIcon from 'babel!svg-react!assets/icons/report-icon.svg?name=ReportIcon';
import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';

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

class LayerItem extends Component {

  constructor(props) {
    super(props);
    this.opacityRangeConfig = _.cloneDeep(INPUT_RANGE_DEFAULT_CONFIG);
    _.assign(this.opacityRangeConfig, {
      minValue: 10,
      maxValue: 100,
      step: 1,
      value: this.props.layer.opacity * 100
    });

    this.hueRangeConfig = _.cloneDeep(INPUT_RANGE_DEFAULT_CONFIG);
    _.assign(this.hueRangeConfig, {
      minValue: 0,
      maxValue: 360,
      step: VESSELS_HUES_INCREMENT,
      value: this.props.layer.hue
    });
    this.hueRangeConfig.classnames.component = 'blending-range -hue';

    this.state = {
      opacityRangeValue: this.opacityRangeConfig.value,
      hueRangeValue: this.hueRangeConfig.value
    };
  }

  onChangeVisibility() {
    if (this.props.layer.visible && this.props.showBlending) {
      this.props.onLayerBlendingToggled(this.props.layerIndex);
    }

    this.props.toggleLayerVisibility(this.props.layer.id);
  }

  onChangeOpacity(component, value) {
    const transparency = parseFloat(value) / 100;

    this.setState({
      opacityRangeValue: value
    });

    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer.id);
    }

    this.props.setLayerOpacity(transparency, this.props.layer.id);
  }

  onChangeHue(component, value) {
    this.setState({
      hueRangeValue: value
    });

    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer.id);
    }

    this.props.setLayerHue(value, this.props.layer.id);
  }

  onClickReport() {
    this.props.toggleReport(this.props.layer.id, this.props.layer.title);
  }

  onClickInfo() {
    const modalParams = {
      open: true,
      info: this.props.layer
    };

    this.props.openLayerInfoModal(modalParams);
  }

  toggleBlending() {
    this.props.onLayerBlendingToggled(this.props.layerIndex);
  }

  getColor(layer) {
    if (layer.hue !== undefined) {
      return hueToRgbString(layer.hue);
    }
    return layer.color;
  }

  render() {
    if (!this.state.opacityRangeValue) return null;

    return (
      <li
        className={LayerListStyles['layer-item']}
      >
        <label>
          <input
            className={SwitcherStyles['c-switcher']}
            type="checkbox"
            checked={this.props.layer.visible}
            onChange={() => this.onChangeVisibility()}
            key={this.getColor(this.props.layer)}
            style={{
              color: this.getColor(this.props.layer)
            }}
          />
          <span className={LayerListStyles['layer-title']}>
            {this.props.layer.title}
          </span>
        </label>
        <ul className={LayerListStyles['layer-option-list']}>
          {this.props.userCanReport && this.props.layer.reportable && <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.onClickReport()}
          >
            <ReportIcon
              className={classnames({ [`${LayerListStyles['-highlighted']}`]: this.props.isCurrentlyReported })}
            />
          </li>}
          <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.toggleBlending()}
          >
            <BlendingIcon className={classnames({ [`${LayerListStyles['-highlighted']}`]: this.props.showBlending })} />
          </li>
          <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.onClickInfo()}
          >
            <InfoIcon />
          </li>
        </ul>
        <div
          className={classnames(BlendingStyles['c-blending'], { [`${BlendingStyles['-is-visible']}`]: this.props.showBlending })}
          ref={(opacityMenu) => { this.opacityMenu = opacityMenu; }}
        >
          Opacity
          <InputRange
            classNames={this.opacityRangeConfig.classnames}
            value={this.state.opacityRangeValue}
            maxValue={this.opacityRangeConfig.maxValue}
            minValue={this.opacityRangeConfig.minValue}
            onChange={(component, value) => this.onChangeOpacity(component, value)}
            step={this.opacityRangeConfig.step}
          />
        {this.props.layer.type === LAYER_TYPES.ClusterAnimation && <div>
          Hue
          <InputRange
            classNames={this.hueRangeConfig.classnames}
            value={this.state.hueRangeValue}
            maxValue={this.hueRangeConfig.maxValue}
            minValue={this.hueRangeConfig.minValue}
            onChange={(component, value) => this.onChangeHue(component, value)}
            step={this.hueRangeConfig.step}
          />
        </div>}
        </div>
      </li>
    );
  }
}

LayerItem.propTypes = {
  layerIndex: React.PropTypes.number,
  layer: React.PropTypes.object,
  isCurrentlyReported: React.PropTypes.bool,
  toggleLayerVisibility: React.PropTypes.func,
  toggleReport: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func,
  setLayerHue: React.PropTypes.func,
  openLayerInfoModal: React.PropTypes.func,
  onLayerBlendingToggled: React.PropTypes.func,
  showBlending: React.PropTypes.bool,
  userCanReport: React.PropTypes.bool
};

export default LayerItem;
