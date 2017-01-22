/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import ToolTip from 'components/Shared/ToolTip';
import { render } from 'react-dom';

class ToolTipJSON extends Component {

  componentDidMount() {
    const tooltips = this.c.getElementsByTagName('tooltip');
    if (tooltips && tooltips.length) {
      for (let i = 0, length = tooltips.length; i < length; i++) {
        const text = tooltips[i].getAttribute('text');
        const href = tooltips[i].getAttribute('href');
        render(<ToolTip text={text} href={href}>{tooltips[i].innerHTML}</ToolTip>, tooltips[i]);
      }
    }
  }

  render() {
    return (
      <p
        dangerouslySetInnerHTML={{
          __html: this.props.html
        }}
        ref={c => (this.c = c)}
      />
    );
  }
}

ToolTipJSON.propTypes = {
  html: React.PropTypes.string
};

export default ToolTipJSON;
