import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from 'styles/components/map/c-no-login.scss';

class NoLogin extends Component {

  render() {
    return (
      <div className={styles['c-no-login']}>
        <h2 className={styles.title}>Login required</h2>
        <div className={styles.content}>
          To view the Map, you must have a user account. Click{' '}
          <a onClick={this.props.login}>here</a> to login or register.
        </div>
        <Link to="/" className={styles.back}>Visit Home Page</Link>
      </div>
    );
  }

}

NoLogin.propTypes = {
  login: React.PropTypes.func
};


export default NoLogin;
