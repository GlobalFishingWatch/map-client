import React, { Component } from 'react';

const ACCESS_TOKEN_REGEX = /#access_token=([a-zA-Z0-9.\-_]*)(&[a-z=])?/g;

class App extends Component {

  componentWillMount() {
    // TODO move this logic out of a presentational component
    ACCESS_TOKEN_REGEX.lastIndex = 0;
    if (ACCESS_TOKEN_REGEX.test(window.location.hash)) {
      ACCESS_TOKEN_REGEX.lastIndex = 0;
      const parts = ACCESS_TOKEN_REGEX.exec(window.location.hash);
      if (parts && parts.length >= 2) {
        this.props.setToken(parts[1]);
      }
    }
    this.props.getLoggedUser();

    this.props.setWelcomeModalUrl();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.welcomeModalUrl !== this.props.welcomeModalUrl) this.getWelcomeModal();
  }

  getWelcomeModal() {
    const storedUrl = localStorage.getItem(WELCOME_MODAL_COOKIE_KEY);
    if (this.props.welcomeModalUrl && storedUrl !== this.props.welcomeModalUrl) {
      localStorage.setItem(WELCOME_MODAL_COOKIE_KEY, this.props.welcomeModalUrl);
      this.props.setWelcomeModalContent();
    }
  }

  render() {
    return (
      <div className="full-height-container">
        {this.props.loading && <div>Loading....</div>}
        {this.props.children}
      </div>
    );
  }

}

App.propTypes = {
  loading: React.PropTypes.bool,
  children: React.PropTypes.object,
  setToken: React.PropTypes.func,
  getLoggedUser: React.PropTypes.func,
  setWelcomeModalUrl: React.PropTypes.func,
  setWelcomeModalContent: React.PropTypes.func,
  welcomeModalUrl: React.PropTypes.string
};


export default App;
