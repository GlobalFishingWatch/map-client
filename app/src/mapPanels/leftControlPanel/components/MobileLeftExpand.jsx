import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MobileLeftExpandStyles from 'styles/components/mobile-left-expand.scss';
import classnames from 'classnames';

class MobileLeftExpand extends Component {
  constructor() {
    super();
    this.state = { expanded: true };
  }

  renderExpandItem() {
    return (
      <div
        className={
          classnames(
            MobileLeftExpandStyles.mobileLeftExpand,
            { [MobileLeftExpandStyles.expanded]: this.state.expanded }
          )}
      >
        <div
          className={MobileLeftExpandStyles.expandButtonLeft}
          onClick={() => this.setState({ expanded: !this.state.expanded })}
        >
          <span className={MobileLeftExpandStyles.arrow} />
        </div>
        {this.state.expanded &&
          <div className={MobileLeftExpandStyles.content} >
            {this.props.children}
          </div>
        }
      </div>
    );
  }

  render() {
    return (this.renderExpandItem());
  }
}

MobileLeftExpand.propTypes = {
  children: PropTypes.node.isRequired,
  isEmbedded: PropTypes.bool.isRequired
};

export default MobileLeftExpand;
