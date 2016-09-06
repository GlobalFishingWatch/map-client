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
    this.onMouseOutBound = this.onMouseOut.bind(this);
  }

  onClick(e) {
    e.stopPropagation();
    this.setState({
      visible: true
    });
  }

  onMouseOver() {
    this.showToolTip();
    this.onMouseOutDebounced.cancel();
    document.addEventListener('click', this.onMouseOutBound);
  }

  onMouseOut() {
    document.removeEventListener('click', this.onMouseOutBound);
    this.onMouseOutDebounced.cancel();

    this.setState({
      visible: false
    });
  }

  showToolTip() {
    const bounds = this.refs.info.getBoundingClientRect();

    const left = bounds.left; // Horizontal position relative to the screen
    const height = bounds.height;
    const width = bounds.width;

    // Position relative to the abbr element
    const offsetTop = this.refs.info.offsetTop;

    // If true, the arrow is on the right of the tooltip
    const arrowRight = left + 100 >= window.innerWidth;
    // If true, the arrow is on the left of the tooltip
    const arrowLeft = left - 100 <= 0;

    // Offset between the tip and the button
    const offset = 10;

    let transform = `translate(calc(50% - ${width / 2}px), calc(${height}px + ${offset}px))`;
    if (arrowLeft) {
      transform = `translate(calc(100% + ${offset}px), calc(${offsetTop + height / 2}px - 50%))`;
    } else if (arrowRight) {
      transform = `translate(-${width / 2 + offset}px, calc(${offsetTop + height / 2}px - 50%))`;
    }

    this.setState({
      arrowRight,
      arrowLeft,
      visible: true,
      transform
    });
  }

  render() {
    let content;
    if (this.state.visible) {
      let link;
      if (this.props.href) {
        link = (<a className={ToolTipStyle['c-tooltip-info-link']} href={this.props.href} target="_blank">
          read more...
        </a>);
      }
      content = (
        <span
          className={classnames({
            [ToolTipStyle['c-tooltip-info-content']]: true,
            [ToolTipStyle['-right']]: !!this.state.arrowRight,
            [ToolTipStyle['-left']]: !!this.state.arrowLeft
          })}
          style={{
            transform: this.state.transform
          }}
        >
        {this.props.text}<br />
        {link}
        </span>);
    }
    return (
      <abbr
        title={this.props.text}
        className={classnames(ToolTipStyle['c-tooltip-info'], ToolTipStyle[`-${this.props.iconColor || 'gray'}`])}
        onClick={e => { this.onClick(e); }}
        onMouseEnter={() => { this.onMouseOver(); }}
        onMouseLeave={() => { this.onMouseOutDebounced(); }}
      >
        <span
          className={ToolTipStyle['c-tooltip-info-title']}

        >
          {this.props.children}
          <img
            ref="info"
            src={iconInfoBlack}
            className={ToolTipStyle['image-icon']}
            alt="icon info"
          />
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
