import React, { Component } from 'react';
import classnames from 'classnames';
import RhombusStyles from '../../../styles/components/shared/c-rhombus.scss';

// This component is used to replace the rhombus element around the website.
// Feel free to customize it and improve it if need.
class Rhombus extends Component {

  render() {
    return (
      <div
        className={
        classnames(RhombusStyles['c-rhombus'], RhombusStyles[this.props.direction], RhombusStyles[this.props.color])
        }
        onClick={this.props.onClick}
      >
        <span className={RhombusStyles.rhombus}></span>
        {this.props.children &&
          <span className={RhombusStyles.text}>{this.props.children}</span>}
      </div>
    );
  }
}

Rhombus.propTypes = {
  children: React.PropTypes.node,
  direction: React.PropTypes.string,
  color: React.PropTypes.string,
  onClick: React.PropTypes.func
};

export default Rhombus;
