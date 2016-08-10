import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from '../../../styles/components/map/c-share.scss';
import button from '../../../styles/components/c-button.scss';

class NoLogin extends Component {

  render() {
    return (
      <div className={styles['c-share']}>
        <h2 className={styles.title}>Login required</h2>
        <p className={styles.intro}>
          In order to access the map, you first need to login.
        </p>
        <a className={button.c_btn_primary} onClick={this.props.login}>Login</a>
        <a className={button.c_btn_primary} onClick={this.props.register}>Register</a>
        <Link to="/">Back to homepage</Link>
      </div>
    );
  }

}

NoLogin.propTypes = {
  login: React.PropTypes.func,
  register: React.PropTypes.func
};


export default NoLogin;
