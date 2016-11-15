import React, { Component } from 'react';
import classnames from 'classnames';
import InputRange from 'react-input-range';
import layerPanelStyle from '../../../styles/components/map/c-layer-panel.scss';
import iconsStyles from '../../../styles/icons.scss';

class LayerItem extends Component {

  constructor(props) {
    super(props);

    this.defaultConfig = {
      classnames: {
        component: 'opacity-range',
        labelMax: 'label -max',
        labelMin: 'label -min',
        labelValue: 'label -current',
        trackActive: 'track-active',
        trackContainer: 'track-container',
        sliderContainer: 'thumb-container',
        slider: 'thumb'
      },
      minValue: 0,
      maxValue: 100,
      step: 10,
      value: 50
    };

    this.state = {
      rangeValue: this.defaultConfig.value
    };
  }

  // mandatory callback for range element. Updates itself.
  onChangeOpacity(component, value) {
    const transparency = parseInt(value, 10) / 100;

    this.setState({
      rangeValue: value
    });

    this.props.setLayerOpacity(transparency, this.props.layer);
  }

  // onClickReport(event) {
  //   console.log(event);
  // }

  //
  // onClickInfo(event) {
  //   console.log(event);
  // }


  toggleOpacityMenu() {
    this.opacityMenu.classList.toggle(layerPanelStyle['-is-visible']);
  }

  render() {
    return (
      <li
        className={layerPanelStyle['layer-item']}
      >
        <label>
          <input
            className={layerPanelStyle.switcher}
            type="checkbox"
            checked={this.props.layer.visible}
            onChange={() => this.props.toggleLayerVisibility(this.props.layer)}
            style={{
              color: this.props.layer.color
            }}
          />
          <span className={layerPanelStyle['layer-name']}>
            {this.props.layer.title}
          </span>
        </label>
        <ul className={layerPanelStyle['layer-options-list']}>
          <li
            className={layerPanelStyle['layer-options-item']}
            onClick={this.onClickReport}
          >
            <svg className={classnames(iconsStyles.icon, iconsStyles['icon-report-icon'])}>
              <use xlinkHref="#icon-report-icon"></use>
            </svg>
          </li>
          <li
            className={layerPanelStyle['layer-options-item']}
            onClick={() => this.toggleOpacityMenu()}
          >
            <svg className={classnames(iconsStyles.icon, iconsStyles['icon-opacity-icon'])}>
              <use xlinkHref="#icon-opacity-icon"></use>
            </svg>
          </li>
          <li
            className={layerPanelStyle['layer-options-item']}
            onClick={this.onClickInfo}
          >
            <svg className={classnames(iconsStyles.icon, iconsStyles['icon-i-icon'])}>
              <use xlinkHref="#icon-i-icon"></use>
            </svg>
          </li>
        </ul>
        <div className={layerPanelStyle['opacity-menu']} ref={(opacityMenu) => { this.opacityMenu = opacityMenu; }}>
          <InputRange
            classNames={this.defaultConfig.classnames}
            value={this.state.rangeValue}
            maxValue={this.defaultConfig.maxValue}
            minValue={this.defaultConfig.minValue}
            onChange={(component, value) => this.onChangeOpacity(component, value)}
            step={this.defaultConfig.step}
          />
        </div>
      </li>
    );
  }
}

LayerItem.propTypes = {
  layer: React.PropTypes.object,
  toggleLayerVisibility: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func
};

export default LayerItem;
