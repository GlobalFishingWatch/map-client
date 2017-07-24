import PropTypes from 'prop-types';
import React, { Component } from 'preact';
import classnames from 'classnames';

import ExpandButtonStyles from 'styles/components/shared/c-expand-button.scss';

class ExpandButton extends Component {

  render() {
    return (
      <button
        onClick={this.props.onExpand}
        className={classnames(ExpandButtonStyles['c-expand-button'],
          { [`${ExpandButtonStyles['-expanded']}`]: this.props.isExpanded })}
      />
    );
  }
}

ExpandButton.propTypes = {
  isExpanded: PropTypes.bool,
  onExpand: PropTypes.func
};

export default ExpandButton;
