/* eslint-disable react/no-danger */
import React, { Component } from 'react';

class WelcomeModal extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.content }} />
    );
  }
}

WelcomeModal.propTypes = {
  closeModal: React.PropTypes.func,
  content: React.PropTypes.string
};

export default WelcomeModal;
