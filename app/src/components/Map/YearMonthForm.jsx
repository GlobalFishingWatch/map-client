import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import 'styles/components/map/datepicker.scss';
import 'react-day-picker/lib/style.css';

class YearMonthForm extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { year, month } = e.target.form;
    this.props.onChange(moment(new Date(year.value, month.value)));
  }

  render() {
    const months = this.props.localeUtils.getMonths();

    const years = [];
    for (let i = this.props.minDate.getFullYear(); i <= this.props.maxDate.getFullYear(); i += 1) {
      years.push(i);
    }

    return (
      <form className="DayPicker-Caption" >
        <select name="month" onChange={this.onChange} value={this.props.date.getMonth()} >
          {months.map((month, i) => <option key={i} value={i} >{month}</option >)}
        </select >
        <select name="year" onChange={this.onChange} value={this.props.date.getFullYear()} >
          {years.map((year, i) => (<option key={i} value={year} >{year}</option >)
          )}
        </select >
      </form >
    );
  }
}

YearMonthForm.propTypes = {
  onChange: PropTypes.func,
  /**
   * title of the datepicker
   */
  label: PropTypes.string,
  /**
   * Current  date set (a Date object)
   */
  date: PropTypes.object,
  /**
   * Minimum allowed start date (a Date object).
   */
  minDate: PropTypes.object,
  /**
   * Maximum allowed start date (a Date object).
   */
  maxDate: PropTypes.object,
  localeUtils: PropTypes.object
};

export default YearMonthForm;
