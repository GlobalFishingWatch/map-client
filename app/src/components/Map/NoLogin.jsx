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
          You must log in to view the Map. If you are a registered user,&nbsp;
          <a onClick={this.props.login}>log in here</a>
        </p>
        <p className={styles.content}>
          If you are not a registered user, <Link to="/">sign-up here</Link> to view the Map.
        </p>
      </div>
    );
  }

}

NoLogin.propTypes = {
  login: React.PropTypes.func
};


export default NoLogin;
