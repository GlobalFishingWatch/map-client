import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from '../../../styles/components/map/c-share.scss';

class NoLogin extends Component {

  render() {
    return (
      <div className={styles['c-share']}>
        <h2 className={styles.title}>Login required</h2>
        <p className={styles.intro}>
          You must log in to view the Map. If you are a registered user, <a onClick={this.props.login}>log in here</a>
        </p>
        <p>
          If you are not a registered user, learn more about Global Fishing Watch <Link to="/">here</Link>
        </p>
      </div>
    );
  }

}

NoLogin.propTypes = {
  login: React.PropTypes.func,
  register: React.PropTypes.func
};


export default NoLogin;
