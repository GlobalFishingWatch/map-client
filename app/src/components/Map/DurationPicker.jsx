import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { DURATION_PICKER_OPTIONS } from 'constants';

import css from 'styles/components/map/c-durationpicker.scss';
import iconStyles from 'styles/icons.scss';

import SettingsIcon from 'assets/icons/duration_settings.svg';

class DurationPicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showSettingsMenu: false
    };

    this.hideSettingsPanelBinded = this.hideSettingsPanel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      extent: nextProps.extent
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState === this.state) return;

    if (nextState.showSettingsMenu) {
      this.setEventListeners();
    } else {
      this.removeEventListeners();
    }
  }

  setEventListeners() {
    document.querySelector('body').addEventListener('click', this.hideSettingsPanelBinded);
  }

  getHumanizedDuration(extent) {
    if (!extent) return '';
    const innerDelta = moment(extent[1])
      .diff(moment(extent[0]));
    return moment.duration(innerDelta).humanize();
  }

  getWidth(extentPx) {
    return `${extentPx[1] - extentPx[0]}px`;
  }

  getLeft(extentPx) {
    return `${extentPx[0]}px`;
  }

  setTimeRange(event) {
    const durationIndex = event.currentTarget.getAttribute('data-index');
    const duration = DURATION_PICKER_OPTIONS[durationIndex];
    this.props.onTimeRangeSelected(duration.asMilliseconds());
  }

  removeEventListeners() {
    document.querySelector('body').removeEventListener('click', this.hideSettingsPanelBinded);
  }

  toggleSettingsMenu() {
    this.setState({
      showSettingsMenu: !this.state.showSettingsMenu
    });
  }

  hideSettingsPanel(event) {
    if (!this.el || this.svg.contains(event.target) || this.el.contains(event.target)) return;

    this.setState({
      showSettingsMenu: false
    });
  }

  render() {
    const humanizedDuration = this.getHumanizedDuration(this.state.extent);
    const style = {
      width: this.getWidth(this.props.extentPx),
      left: this.getLeft(this.props.extentPx)
    };

    let durations;
    if (this.state.showSettingsMenu) {
      durations = DURATION_PICKER_OPTIONS.map((duration, i) =>
        (<li
          className={css['settings-item']}
          data-index={i}
          key={i}
          onClick={(e) => this.setTimeRange(e)}
        >{duration.humanize()}</li>)
      );
    }

    return (
      <div style={style} className={css['c-durationpicker']}>
        <div className={css.container}>
          <img
            alt="settings duration"
            src={SettingsIcon}
            className={classnames(iconStyles.icon, css['icon-settings'])}
            onClick={() => this.toggleSettingsMenu()}
            ref={(elem) => { this.svg = elem; }}
          />

        {this.state.showSettingsMenu &&
          <div className={css['setttings-panel']} ref={(elem) => { this.el = elem; }}>
            <ul className={css['settings-list']}>
              {durations}
            </ul>
          </div>
        }

          <div className={css['c-durationpicker-text']}>
            {humanizedDuration}
          </div>
        </div>
      </div>
    );
  }
}

DurationPicker.propTypes = {
  extent: React.PropTypes.array,
  extentPx: React.PropTypes.array,
  onTimeRangeSelected: React.PropTypes.func
};

export default DurationPicker;
