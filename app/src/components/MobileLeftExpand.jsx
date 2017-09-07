import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MobileLeftExpandStyles from 'styles/components/mobile-left-expand.scss';
import MediaQuery from 'react-responsive';
import classnames from 'classnames';

class MobileLeftExpand extends Component {
  constructor() {
    super();
    this.state = { expanded: false };
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
    return (
      <MediaQuery minWidth={768} >
        {desktop => (
          desktop ?
            <div className={MobileLeftExpandStyles.mobileLeftExpand} >
              {this.props.children}
            </div>
            :
            this.renderExpandItem()
        )}
      </MediaQuery >
    );
  }
}

MobileLeftExpand.propTypes = {
  children: PropTypes.node.isRequired
};

export default MobileLeftExpand;
