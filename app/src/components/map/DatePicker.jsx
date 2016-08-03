import React, { Component } from 'react';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }


  onChange(m) {
    // convert moment to date
    this.props.onChange(m.clone().toDate());
  }

  render() {
    return (
      <div>
        <ReactDatePicker
          selected={moment(this.props.selected)}
          minDate={moment(this.props.minDate)}
          maxDate={moment(this.props.maxDate)}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

DatePicker.propTypes = {
  onChange: React.PropTypes.func,
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
