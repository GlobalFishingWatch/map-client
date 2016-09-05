import React, { Component } from 'react';
import classnames from 'classnames';
import '../../../styles/components/shared/c-rhombus.scss';

// This component is used to replace the rhombus element around the website.
// Feel free to customize it and improve it if need.
class Rhombus extends Component {

  render() {
    return (
      <div
        className={classnames({
          'c-rhombus': true,
          [this.props.direction]: !!this.props.direction,
          [this.props.color]: !!this.props.color
        })}
        onClick={this.props.onClick}
      >
        <span
          className={classnames({
            rhombus: true,
            [this.props.color]: !!this.props.color
          })}
        ></span>
        {this.props.children &&
          <span
            className={classnames({
              text: true,
              [this.props.color]: !!this.props.color
            })}
          >
            {this.props.children}
          </span>}
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
