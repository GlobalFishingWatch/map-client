import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ToggleStyles from 'styles/components/shared/toggle.scss';
import classnames from 'classnames';
import { hueToRgbString } from 'util/colors';

class Toggle extends Component {
  getColor() {
    if (this.props.hue !== undefined) {
      return hueToRgbString(this.props.hue);
    }
    return this.props.color;
  }

  render() {
    return (<div
      className={classnames(ToggleStyles.toggle, { [ToggleStyles._active]: this.props.on })}
      style={this.props.on ? { background: this.getColor() } : null}
    >
      <input
        type="checkbox"
        onChange={() => this.props.onToggled()}
        checked={this.props.on}
        readOnly
      />
      <div className={ToggleStyles.toggleBall}>
        <span
          className={ToggleStyles.toggleInnerBall}
          style={this.props.on ? { background: this.getColor() } : null}
        />
      </div>
    </div>);
  }
}

Toggle.propTypes = {
  on: PropTypes.bool,
  hue: PropTypes.number,
  color: PropTypes.string,
  onToggled: PropTypes.func
};

export default Toggle;
