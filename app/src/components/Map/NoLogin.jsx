import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from 'styles/components/map/c-no-login.scss';

class NoLogin extends Component {

  render() {
    return (
      <div className={styles['c-no-login']}>
        <h2 className={styles.title}>Access needed</h2>
        <div className={styles.content}>
          <p>To view the Map, you must have a user account.</p>
          <a className={styles['btn-action']} onClick={this.props.login}>log in / register</a>
          <p className={styles['paragraph-back']}>Or visit our <Link to="/" className={styles.back}>Home Page</Link></p>
        </div>
      </div>
    );
  }

}

NoLogin.propTypes = {
  login: React.PropTypes.func
};


export default NoLogin;
