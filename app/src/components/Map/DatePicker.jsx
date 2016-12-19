import React, { Component } from 'react';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'styles/components/map/c-datepicker.scss';
import { TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE } from 'constants';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.selected
    });
  }

  onChange(m) {
    // convert moment to date
    this.props.onChange(m.clone().toDate());

    this.setState({
      selected: m
    });
  }

  render() {
    const stringDate = this.state.selected ? moment(this.state.selected).format('DD MMM YYYY') : '-';
    const minDate = this.props.minDate ? moment(this.props.minDate).add(1, 'day') : TIMELINE_OVERALL_START_DATE;

    return (
      <div className="c-datepicker">
        <div className="c-datepicker-title">
          {this.props.literalDate}
        </div>
        <div className="datepicker-date">
          {stringDate}
        </div>
        <ReactDatePicker
          fixedHeight
          selected={moment(this.props.selected)}
          minDate={minDate}
          maxDate={TIMELINE_OVERALL_END_DATE}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

DatePicker.propTypes = {
  onChange: React.PropTypes.func,
  /**
  * title of the datepicker
  */
  literalDate: React.PropTypes.string,
  /**
   * Current  date set (a Date object)
   */
  selected: React.PropTypes.object,
  /**
   * Minimum allowed start date (a Date object).
   */
  minDate: React.PropTypes.object,
  /**
   * Maximum allowed start date (a Date object).
   */
  maxDate: React.PropTypes.object
};

export default DatePicker;
