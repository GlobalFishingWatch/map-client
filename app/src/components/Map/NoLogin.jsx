import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from '../../../styles/components/map/c-no-login.scss';

class NoLogin extends Component {

  render() {
    return (
      <div className={styles['c-no-login']}>
        <p className={styles.back}>
          <Link to="/">￩ Visit Home Page</Link>
        </p>
        <h2 className={styles.title}>Login required</h2>
        <p className={styles.content}>
          To view the Map, you must have a user account. Click{' '}
          <a onClick={this.props.login}>here</a> to login or register.
        </p>
      </div>
    );
  }

}

NoLogin.propTypes = {
  login: React.PropTypes.func
};


export default NoLogin;
