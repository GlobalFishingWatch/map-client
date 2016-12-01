import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import css from 'styles/components/map/c-durationpicker.scss';
import iconStyles from 'styles/icons.scss';

import SetttingsIcon from 'babel!svg-react!assets/icons/duration_settings.svg?name=SetttingsIcon';

class DurationPicker extends Component {

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

  render() {
    const humanizedDuration = this.getHumanizedDuration(this.props.extent);
    const style = {
      width: this.getWidth(this.props.extentPx),
      left: this.getLeft(this.props.extentPx)
    };

    return (
      <div style={style} className={css['c-durationpicker']}>
        <div className={css.container}>
          <SetttingsIcon
            className={classnames(iconStyles.icon, css['icon-settings'])}
          />
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
  extentPx: React.PropTypes.array
};

export default DurationPicker;
