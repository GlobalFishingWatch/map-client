import PropTypes from 'prop-types';
import React, { Component } from 'preact';
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
    let filterFunc = null;
    const humanizedDuration = this.getHumanizedDuration(this.state.extent);
    const style = {
      width: this.getWidth(this.props.extentPx),
      left: this.getLeft(this.props.extentPx)
    };

    // filters predefined time ranges to avoid overlapping the whole timebar
    // when its range is lesser than the available options
    if (this.props.timelineOuterExtent) {
      const diffTime = moment.duration(this.props.timelineOuterExtent[1] - this.props.timelineOuterExtent[0]);
      filterFunc = duration => moment.duration(diffTime) >= duration;
    }

    let durations;
    if (this.state.showSettingsMenu) {
      durations = DURATION_PICKER_OPTIONS.filter(filterFunc)
      .map((duration, i) =>
        (<li
          className={css['settings-item']}
          data-index={i}
          key={i}
          onClick={e => this.setTimeRange(e)}
        >{duration.humanize()}</li>)
      );
    }

    return (
      <div
        style={style}
        className={css['c-durationpicker']}
        onClick={() => this.toggleSettingsMenu()}
        ref={(elem) => { this.svg = elem; }}
      >
        <div className={css.container}>
          <img
            alt="settings duration"
            src={SettingsIcon}
            className={classnames(iconStyles.icon, css['icon-settings'])}
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
  extent: PropTypes.array,
  extentPx: PropTypes.array,
  timelineOuterExtent: PropTypes.array,
  onTimeRangeSelected: PropTypes.func
};

export default DurationPicker;
