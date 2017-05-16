import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from 'styles/components/map/c-no-login.scss';

class NoLogin extends Component {

  render() {
    return (
      <div className={styles['c-no-login']}>
        <h2 className={styles.title}>Access needed</h2>
        <div className={styles.content}>
          <p>To view the Map, you must have a user account. Click below to access, or visit our{' '}
            <a href="/" className={styles.back}>Home Page</a>
          </p>
          <a className={styles['btn-action']} onClick={this.props.login}>log in / register</a>
        </div>
      </div>
    );
  }

}

NoLogin.propTypes = {
  login: PropTypes.func
};

export default NoLogin;
