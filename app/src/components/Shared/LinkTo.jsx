import React, { Component } from 'react';
import LinkToStyles from '../../../styles/components/shared/c-link-to.scss';

class LinkTo extends Component {

  getClassName() {
    const direction = this.props.direction ? LinkToStyles[this.props.direction] : '';
    const color = this.props.color ? LinkToStyles[this.props.color] : '';

    return `${LinkToStyles['c-link-to']} ${direction} ${color}`;
  }

  render() {
    return (
      <div className={this.getClassName()} onClick={this.props.onClick}>
        <span className={LinkToStyles.rhombus}></span>
        {this.props.children &&
          <span className={LinkToStyles.text}>{this.props.children}</span>}
      </div>
    );
  }
}

LinkTo.propTypes = {
  children: React.PropTypes.node,
  direction: React.PropTypes.string,
  color: React.PropTypes.string,
  onClick: React.PropTypes.func
};

export default LinkTo;
