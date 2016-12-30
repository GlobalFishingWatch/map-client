import _ from 'lodash';
import React, { Component } from 'react';
import classnames from 'classnames';
import InputRange from 'react-input-range';
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
      step: 10,
      value: this.props.layer.opacity * 100
    });

    this.hueRangeConfig = _.cloneDeep(INPUT_RANGE_DEFAULT_CONFIG);
    _.assign(this.hueRangeConfig, {
      minValue: 0,
      maxValue: 360,
      step: 10,
      value: this.props.layer.hue
    });

    this.state = {
      opacityRangeValue: this.opacityRangeConfig.value,
      hueRangeValue: this.hueRangeConfig.value,
      showBlending: false
    };
  }

  onChangeOpacity(component, value) {
    const transparency = parseFloat(value) / 100;

    this.setState({
      opacityRangeValue: value
    });

    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer);
    }

    this.props.setLayerOpacity(transparency, this.props.layer);
  }

  onChangeHue(component, value) {
    this.setState({
      hueRangeValue: value
    });

    if (!this.props.layer.visible) {
      this.props.toggleLayerVisibility(this.props.layer);
    }
  }

  // onClickReport(event) {
  //   console.log(event);
  // }

  onClickInfo() {
    const modalParams = {
      open: true,
      info: this.props.layer
    };

    this.props.openLayerInfoModal(modalParams);
  }

  onChangeSwitch() {
    if (this.props.layer.visible) {
      this.setState({
        showBlending: false
      });
    }

    this.props.toggleLayerVisibility(this.props.layer);
  }


  toggleBlending() {
    this.setState({
      showBlending: !this.state.showBlending
    });
  }

  render() {
    const cssClassBlending = this.state.showBlending ?
      classnames(BlendingStyles['c-blending'], BlendingStyles['-is-visible']) :
      BlendingStyles['c-blending'];

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
            onChange={() => this.onChangeSwitch()}
            style={{
              color: this.props.layer.color
            }}
          />
          <span className={LayerListStyles['layer-title']}>
            {this.props.layer.title}
          </span>
        </label>
        <ul className={LayerListStyles['layer-option-list']}>
          {this.props.layer.reportable && <li
            className={LayerListStyles['layer-option-item']}
            onClick={this.onClickReport}
          >
            <ReportIcon />
          </li>}
          <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.toggleBlending()}
          >
            <BlendingIcon />
          </li>
          <li
            className={LayerListStyles['layer-option-item']}
            onClick={() => this.onClickInfo()}
          >
            <InfoIcon />
          </li>
        </ul>
        <div className={cssClassBlending} ref={(opacityMenu) => { this.opacityMenu = opacityMenu; }}>
          Opacity
          <InputRange
            classNames={this.opacityRangeConfig.classnames}
            value={this.state.opacityRangeValue}
            maxValue={this.opacityRangeConfig.maxValue}
            minValue={this.opacityRangeConfig.minValue}
            onChange={(component, value) => this.onChangeOpacity(component, value)}
            step={this.opacityRangeConfig.step}
          />
          Hue
          <InputRange
            classNames={this.hueRangeConfig.classnames}
            value={this.state.hueRangeValue}
            maxValue={this.hueRangeConfig.maxValue}
            minValue={this.hueRangeConfig.minValue}
            onChange={(component, value) => this.onChangeHue(component, value)}
            step={this.hueRangeConfig.step}
          />
        </div>
      </li>
    );
  }
}

LayerItem.propTypes = {
  layer: React.PropTypes.object,
  toggleLayerVisibility: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func,
  openLayerInfoModal: React.PropTypes.func
};

export default LayerItem;
