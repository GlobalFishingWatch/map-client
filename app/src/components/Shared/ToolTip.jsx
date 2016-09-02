import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import ToolTipStyle from '../../../styles/components/c-tooltip-info.scss';

class ToolTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false
    };
    this.onMouseOutDebounced = _.debounce(this.onMouseOut, 500);
  }

  onClick() {
    this.setState({
      shown: true
    });
  }

  onMouseOver() {
    this.onMouseOutDebounced.cancel();
    this.setState({
      shown: true
    });
  }
  onMouseOut() {
    this.setState({
      shown: false
    });
  }

  render() {
    let content;
    if (this.state.shown) {
      let link;
      if (this.props.href) {
        link = <a className={ToolTipStyle['c-tooltip-info-link']} href={this.props.href}>read more...</a>;
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
