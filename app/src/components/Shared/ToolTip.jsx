import React, { Component } from 'react';
import { Link } from 'react-router';
import ToolTipStyle from '../../../styles/components/c-tooltip-info.scss';
import ImgWhite from '../../../assets/icons/info_white.svg';
import ImgBlack from '../../../assets/icons/info_black.svg';

class ToolTip extends Component {

  render() {
    return (
      <a
        href="/definitions/fishing-effort"
        className={ToolTipStyle['c-tooltip-info']}
      >
        <img src={this.props.iconColor === 'black' ? ImgBlack : ImgWhite} alt="info icon"></img>
        <span className={ToolTipStyle['content-tooltip']}>{this.props.children}</span>
      </a>
    );
  }
}

ToolTip.propTypes = {
  iconColor: React.PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ])
};


export default ToolTip;
