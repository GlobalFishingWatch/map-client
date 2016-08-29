import React, { Component } from 'react';
import ToolTip from './ToolTip';
import { render } from 'react-dom';

class ToolTipJSON extends Component {

  componentDidMount() {
    const tooltips = this.c.getElementsByTagName('tooltip');
    if (tooltips) {
      for (let i = 0, length = tooltips.length; i < length; i++) {
        render(<ToolTip iconColor={'black'}>{tooltips[i].innerHTML}</ToolTip>, tooltips[i]);
      }
    }
  }

  render() {
    return (
      <p
        dangerouslySetInnerHTML={{
          __html: this.props.html
        }}
        ref={(c) => (this.c = c)}
      />
    );
  }
}

ToolTipJSON.propTypes = {
  html: React.PropTypes.string
};

export default ToolTipJSON;
