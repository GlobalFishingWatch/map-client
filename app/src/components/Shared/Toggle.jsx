import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ToggleStyles from 'styles/components/shared/toggle.scss';
import classnames from 'classnames';
import { hueOrColorToHexColor } from 'utils/colors';

class Toggle extends Component {
  render() {
    const { on, color, hue } = this.props;
    const hexColor = hueOrColorToHexColor(color, hue);
    const style = (on) ? { backgroundColor: hexColor } : {};
    return (<div
      style={style}
      className={classnames(
        ToggleStyles.toggle,
        { [ToggleStyles._active]: on }
      )}
    >
      <input
        type="checkbox"
        onChange={() => this.props.onToggled()}
        checked={on}
        readOnly
      />
      <div className={ToggleStyles.toggleBall}>
        <span
          style={style}
          className={ToggleStyles.toggleInnerBall}
        />
      </div>
    </div>);
  }
}

Toggle.propTypes = {
  on: PropTypes.bool,
  color: PropTypes.string,
  hue: PropTypes.number,
  onToggled: PropTypes.func
};

export default Toggle;
