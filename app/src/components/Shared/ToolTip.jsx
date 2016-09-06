import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import iconInfoBlack from '../../../assets/icons/info_black.svg';
import ToolTipStyle from '../../../styles/components/c-tooltip-info.scss';

class ToolTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      arrowLeft: false,
      arrowRight: false,
      positionX: 0
    };
    this.onMouseOutDebounced = _.debounce(this.onMouseOut, 500);
  }

  onClick() {
    this.setState({
      visible: true
    });
  }

  onMouseOver() {
    this.showToolTip();
    this.onMouseOutDebounced.cancel();
  }

  onMouseOut() {
    this.setState({
      visible: false
    });
  }

  showToolTip() {
    const abbr = this.refs.info.getBoundingClientRect();
    const xRight = abbr.right + 8; // 8 is half of the size of the icon
    const xLeft = abbr.right - 8; // 8 is half of the size of the icon
        // const y = window.scrollY + abbr.top + abbr.height / 2;

        // 100 is half of the size of the tooltip
    this.setState({
      arrowRight: xRight + 100 >= window.innerWidth,
      arrowLeft: xLeft - 100 <= 0,
      visible: true,
      position: xLeft - 32
    });
  }

  render() {
    let content;
    if (!this.state.visible) {
      let link;
      if (this.props.href) {
        link = (<a className={ToolTipStyle['c-tooltip-info-link']} href={this.props.href} target="_blank">
          read more...
        </a>);
      }
      content = (
        <span
          className={classnames(ToolTipStyle['c-tooltip-info-content'],
          this.state.arrowRight ? ToolTipStyle.right : null,
          this.state.arrowLeft ? ToolTipStyle.left : null)}
          style={this.state.arrowLeft ? { right: this.state.position } : null}
        >
        {this.props.text}<br />
        {link}
        </span>);
    }
    return (
      <abbr
        title={this.props.text}
        className={classnames(ToolTipStyle['c-tooltip-info'], ToolTipStyle[`-${this.props.iconColor || 'gray'}`])}
        onClick={() => { this.onClick(); }}
        onMouseOver={() => { this.onMouseOver(); }}
        onMouseOut={() => { this.onMouseOutDebounced(); }}
      >
        <span
          className={ToolTipStyle['c-tooltip-info-title']}

        >
          {this.props.children}
          <img ref="info" src={iconInfoBlack} className={ToolTipStyle['image-icon']} alt="icon info"></img>
        </span>
        {content}
      </abbr>
    );
  }
}

ToolTip.propTypes = {
  iconColor: React.PropTypes.string,
  text: React.PropTypes.string,
  href: React.PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ])
};


export default ToolTip;
