import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from '../../../styles/components/map/c-no-login.scss';
import ButtonStyle from '../../../styles/components/c-button.scss';

class NoLogin extends Component {

  render() {
    return (
      <div className={styles['c-no-login']}>
        <h2 className={styles.title}>Login required</h2>
        <p className={styles.content}>
          To view the Map, you must have a user account.
        </p>
        <button
          type="button"
          className={ButtonStyle['c-btn-primary']}
          onClick={this.props.login}
        >Login</button>
        <button
          type="button"
          className={ButtonStyle['c-btn-primary']}
          onClick={this.props.login}
        >Register</button>
        <p><Link to="/" className={styles.content}>Go home page</Link></p>
      </div>
    );
  }

}

NoLogin.propTypes = {
  login: React.PropTypes.func
};


export default NoLogin;
