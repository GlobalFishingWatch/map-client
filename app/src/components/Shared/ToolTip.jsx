import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import ToolTipStyle from '../../../styles/components/c-tooltip-info.scss';

class ToolTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
      leftShow: false,
      rightShow: false,
      position: 0
    };
    this.onMouseOutDebounced = _.debounce(this.onMouseOut, 500);
  }

  onClick() {
    this.setState({
      shown: true
    });
  }

  onMouseOver() {
    this.showToolTip();
    this.onMouseOutDebounced.cancel();
  }

  onMouseOut() {
    this.setState({
      shown: false
    });
  }

  showToolTip() {
    const rect = this.refs.info.getBoundingClientRect();
    const checkleft = -100 + (rect.left + window.scrollX);
    const checkright = 100 + (rect.right + window.scrollX);

    this.setState({
      rightShow: checkleft <= 0,
      leftShow: checkright >= window.innerWidth,
      shown: true
    });
  }

  render() {
    let content;
    if (!this.state.shown) {
      let link;
      if (this.props.href) {
        link = (<a className={ToolTipStyle['c-tooltip-info-link']} href={this.props.href} target="_blank">
          read more...
        </a>);
      }
      content = (
        <span
          className={classnames(ToolTipStyle['c-tooltip-info-content'],
          this.state.leftShow ? ToolTipStyle.left : null,
          this.state.rightShow ? ToolTipStyle.left : null)}
          style={this.state.rightShow ? {} : null}
        >
        {this.props.text}<br />
        {link}
        </span>);
    }
    return (
      <abbr
        title={this.props.text}
        className={classnames(ToolTipStyle['c-tooltip-info'], ToolTipStyle[`-${this.props.iconColor || 'gray'}`])}
        ref="info"
        onClick={() => { this.onClick(); }}
        onMouseOver={() => { this.onMouseOver(); }}
        onMouseOut={() => { this.onMouseOutDebounced(); }}
      >
        <span
          className={ToolTipStyle['c-tooltip-info-title']}

        >
          {this.props.children}
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
