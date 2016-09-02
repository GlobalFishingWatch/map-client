import React, { Component } from 'react';
import classnames from 'classnames';
import ToolTipStyle from '../../../styles/components/c-tooltip-info.scss';

class ToolTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false
    };
  }

  onClick() {
    this.setState({
      shown: !this.state.shown
    });
  }

  onHover() {
    this.setState({
      shown: true
    });
  }

  render() {
    let content;
    if (this.state.shown) {
      let link;
      if (this.props.href) {
        link = (<a className={ToolTipStyle['c-tooltip-info-link']} href={this.props.href} target="_blank">
          read more...
        </a>);
      }
      content = (<span className={ToolTipStyle['c-tooltip-info-content']}>
        {this.props.text}<br />
        {link}
      </span>);
    }
    return (
      <abbr
        title={this.props.text}
        className={classnames(ToolTipStyle['c-tooltip-info'], ToolTipStyle[`-${this.props.iconColor || 'gray'}`])}
      >
        <span
          className={ToolTipStyle['c-tooltip-info-title']}
          onClick={() => { this.onClick(); }}
          onMouseOver={() => { this.onHover(); }}
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
