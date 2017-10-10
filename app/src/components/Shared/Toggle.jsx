import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ToggleStyles from 'styles/components/shared/toggle.scss';
import classnames from 'classnames';
import { hueToClosestColor } from 'util/colors';
import { COLORS } from 'config';

class Toggle extends Component {
  getColor() {
    if (this.props.hue !== undefined) {
      return hueToClosestColor(this.props.hue);
    }
    if (this.props.colorName !== undefined) {
      return COLORS[this.props.colorName];
    }
    return this.props.color;
  }

  render() {
    return (<div
      className={classnames(
        ToggleStyles.toggle,
        { [ToggleStyles._active]: this.props.on },
        { [ToggleStyles[this.getColor()]]: this.props.on }
      )}
    >
      <input
        type="checkbox"
        onChange={() => this.props.onToggled()}
        checked={this.props.on}
        readOnly
      />
      <div className={ToggleStyles.toggleBall}>
        <span
          className={classnames(
            ToggleStyles.toggleInnerBall,
            { [ToggleStyles[this.getColor()]]: this.props.on }
          )}
        />
      </div>
    </div>);
  }
}

Toggle.propTypes = {
  on: PropTypes.bool,
  hue: PropTypes.number,
  color: PropTypes.string,
  colorName: PropTypes.string,
  onToggled: PropTypes.func
};

export default Toggle;
