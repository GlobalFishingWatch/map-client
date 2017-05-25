import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import iconInfoBlack from 'assets/icons/info_black.svg';
import ToolTipStyle from 'styles/components/c-tooltip-info.scss';

class ToolTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      arrowLeft: false,
      arrowRight: false,
      positionX: 0
    };
  }

  componentDidMount() {
    if (this.isTouchDevice()) {
      this.attachTouchEndListener();
    }
  }

  onClick(e) {
    if (!this.isTouchDevice()) return;

    if (this.state.visible) {
      // We don't want the tooltip to close when touching it
      if (!(this.refs.tooltip && this.refs.tooltip.contains(e.target))) {
        this.hideTooltip();
      }
    } else {
      this.showToolTip();
    }
  }

  onMouseEnter() {
    if (this.isTouchDevice()) return;
    this.showToolTip();
  }

  onMouseLeave() {
    if (this.isTouchDevice()) return;
    this.hideTooltip();
  }

  /**
   * Detect if the user's device is touch-based
   *
   * @returns {Boolean} true if touch-based
   */
  isTouchDevice() {
    return (('ontouchstart' in window)
      || (navigator.maxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
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
      transform = `translate(calc(100% + ${offset}px), calc(${offsetTop + (height / 2)}px - 50%))`;
    } else if (arrowRight) {
      transform = `translate(-${(width / 2) + offset}px, calc(${offsetTop + (height / 2)}px - 50%))`;
    }

    this.setState({
      arrowRight,
      arrowLeft,
      visible: true,
      transform
    });
  }

  hideTooltip() {
    this.setState({
      visible: false
    });
  }

  attachTouchEndListener() {
    document.body.addEventListener('touchend', (e) => {
      if (!this.state.visible) return;
      // We just want to hide the tooltip when touching anything else but the tooltip or the abbr
      if (!(this.refs.el && this.refs.el.contains(e.target))) {
        this.hideTooltip();
      }
    });
  }

  render() {
    let content;
    if (this.state.visible) {
      let link;
      if (this.props.href) {
        link = (<a className={ToolTipStyle['c-tooltip-info-link']} href={this.props.href}>
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
          ref="tooltip"
        >
          {this.props.text}<br />
          {link}
        </span>);
    }
    return (
      <abbr
        title={this.props.text}
        className={classnames(ToolTipStyle['c-tooltip-info'], ToolTipStyle[`-${this.props.iconColor || 'gray'}`])}
        onClick={e => this.onClick(e)}
        onMouseEnter={() => this.onMouseEnter()}
        onMouseLeave={() => this.onMouseLeave()}
        ref="el"
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
  iconColor: PropTypes.string,
  text: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ])
};


export default ToolTip;
