import React, { Component } from 'react';
import ToggleStyles from 'styles/components/shared/c-toggle.scss';
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
      className={classnames(ToggleStyles['c-toggle'], { [ToggleStyles['-active']]: this.props.on })}
      style={this.props.on ? { background: this.getColor() } : null}
    >
      <input
        type="checkbox"
        onChange={() => this.props.onToggled()}
        checked={this.props.on}
        readOnly
      />
      <div className={ToggleStyles['toggle-ball']}>
        <span
          className={ToggleStyles['toggle-inner-ball']}
          style={this.props.on ? { background: this.getColor() } : null}
        />
      </div>
    </div>);
  }
}

Toggle.propTypes = {
  on: React.PropTypes.bool,
  hue: React.PropTypes.number,
  color: React.PropTypes.string,
  onToggled: React.PropTypes.func
};

export default Toggle;
