import React, { Component } from 'react';
import moment from 'moment';
import css from 'styles/components/map/c-durationpicker.scss';

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
        <div className={css['c-durationpicker-text']}>
          {humanizedDuration}
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
