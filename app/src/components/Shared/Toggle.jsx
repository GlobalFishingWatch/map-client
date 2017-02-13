import React, { Component } from 'react';
import SwitcherStyles from 'styles/components/shared/c-switcher.scss';
import classnames from 'classnames';
import { hueToRgbString } from 'util/hsvToRgb';

class Toggle extends Component {
  getColor() {
    if (this.props.hue !== undefined) {
      return hueToRgbString(this.props.hue);
    }
    return this.props.color;
  }

  render() {
    return (<div
      className={classnames(SwitcherStyles['c-switcher'], { [SwitcherStyles['-active']]: this.props.on })}
      style={this.props.on ? { background: this.getColor() } : null}
    >
      <input
        type="checkbox"
        onChange={() => this.props.onToggled()}
        checked={this.props.on}
      />
      <div className={SwitcherStyles.toggle} />
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
