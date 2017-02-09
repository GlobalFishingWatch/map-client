import React, { Component } from 'react';

// TODO
class WelcomeModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      url: null
    };
  }

  getCookie() {
    const cookie = document.cookie.split(this.props.cookie);
    if(cookie.length < 2) return null;
    return cookie[1].split('=')[1];
  }



  render() {
    return (
      <span>Welcome message (WIP)</span>
    );
  }
}

WelcomeModal.propTypes = {
  closeModal: React.PropTypes.func
};

export default WelcomeModal;
