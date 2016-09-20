import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
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
    const offset = 10;
    const top = bounds.top + window.scrollY + height + offset;
    const topRight = bounds.top + window.scrollY - 40 + (height / 2);
    const topLeft = bounds.top + window.scrollY - 40 + (height / 2);
    const leftP = left - 100 + (width / 2);
    const leftRight = left - 200 - width;
    const leftLeft = left + width + offset;
    const arrowRight = left + 100 >= window.innerWidth;
    const arrowLeft = left - 100 <= 0;
    let topTooltip = `${top}px`;
    let leftTooltip = `${leftP}px`;
    const topRightToolTip = `${topRight}px`;
    const leftRightToolTip = `${leftRight}px`;
    const topLeftToolTip = `${topLeft}px`;
    const leftLefttToolTip = `${leftLeft}px`;
    if (arrowLeft) {
      topTooltip = topLeftToolTip;
      leftTooltip = leftLefttToolTip;
    } else if (arrowRight) {
      topTooltip = topRightToolTip;
      leftTooltip = leftRightToolTip;
    }

    this.setState({
      arrowRight,
      arrowLeft,
      visible: true,
      topTooltip,
      leftTooltip
    });
  }

  hideTooltip() {
    this.setState({
      visible: false
    });
  }

  attachTouchEndListener() {
    document.body.addEventListener('touchend', e => {
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
        link = (<Link className={ToolTipStyle['c-tooltip-info-link']} to={this.props.href}>
          read more...
        </Link>);
      }
      content = (
        <span
          className={classnames({
            [ToolTipStyle['c-tooltip-info-content']]: true,
            [ToolTipStyle['-right']]: !!this.state.arrowRight,
            [ToolTipStyle['-left']]: !!this.state.arrowLeft
          })}
          style={{
            top: this.state.topTooltip,
            left: this.state.leftTooltip
          }}
          ref="tooltip"
        >
        {this.props.text}<br />
        {link}
        </span>);
    }
    return (
      <span>
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
      </span>
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
