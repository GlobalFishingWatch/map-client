import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import iconStyles from 'styles/icons.scss';
import buttonStyles from 'styles/components/button.scss';
import SpeedArrowIcon from '-!babel-loader!svg-react-loader!assets/icons/arrow-speed.svg?name=SpeedArrowIcon';

class SpeedButton extends Component {

  changeSpeed() {
    const ratio = this.props.decrease ? 0.5 : 2;
    window.speed *= ratio;
  }

  render() {
    return (
      <button
        onClick={() => this.changeSpeed()}
        className={classnames([
          buttonStyles.speedButton,
          { [buttonStyles.decrease]: this.props.decrease }
        ])}
      >
        <SpeedArrowIcon
          className={classnames([iconStyles.icon, iconStyles.speedIcon])}
        />
      </button >
    );
  }
}

SpeedButton.propTypes = {
  decrease: PropTypes.bool
};

export default SpeedButton;
