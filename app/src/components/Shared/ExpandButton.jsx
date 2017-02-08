import React, { Component } from 'react';
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
  isExpanded: React.PropTypes.bool,
  onExpand: React.PropTypes.func
};

export default ExpandButton;
