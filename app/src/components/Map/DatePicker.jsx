import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import YearMonthForm from 'components/Map/YearMonthForm';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'styles/components/map/datepicker.scss';
import 'react-day-picker/lib/style.css';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  setInputsToReadOnly() {
    const inputs = document.getElementsByClassName('date-picker-input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute('readOnly', 'readonly');
    }
  }

  componentDidMount() {
    this.setInputsToReadOnly();
  }

  onChange(m) {
    this.props.onChange(m.clone().toDate());
  }

  renderHeader() {
    return (
      <YearMonthForm
        onChange={this.onChange}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
      />
    );
  }

  render() {
    const dayPickerProps = {
      enableOutsideDays: true,
      fromMonth: this.props.minDate,
      toMonth: this.props.maxDate,
      captionElement: this.renderHeader()
    };

    return (
      <div className="datepicker">
        <div className="datepickerTitle">
          {this.props.label}
        </div >
        <DayPickerInput
          format="DD MMM YYYY"
          className="date-picker-input"
          value={moment(this.props.selected).format('DD MMM YYYY')}
          onDayChange={this.onChange}
          dayPickerProps={dayPickerProps}
        />
      </div >
    );
  }
}

DatePicker.propTypes = {
  onChange: PropTypes.func,
  /**
   * title of the datepicker
   */
  label: PropTypes.string,
  /**
   * Current  date set (a Date object)
   */
  selected: PropTypes.object,
  /**
   * Minimum allowed start date (a Date object).
   */
  minDate: PropTypes.object,
  /**
   * Maximum allowed start date (a Date object).
   */
  maxDate: PropTypes.object
};

export default DatePicker;
