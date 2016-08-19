import React, { Component } from 'react';
import styles from '../../../styles/components/shared/c-footer-mini.scss';

class FooterMini extends Component {

  constructor(props) {
    super(props);
    this.state = {
      footerExpanded: false
    };
  }

  toggleFooter() {
    this.setState({ footerExpanded: !this.state.footerExpanded });
  }

  render() {
    if (this.state.footerExpanded) {
      return (
        <div>Show full footer, don't remove mini one (we still need the link to hide the footer)?</div>
      );
    }

    /**
     * TODO:
     * Don't hide mini footer because we need the link to toggle the full footer
     * Need to review the link and the legal terms
     */

    return (
      <footer className={styles['c-footer-mini']}>
        <ul className={styles.partners}>
          <li>Partner 1</li>
          <li>Partner 2</li>
          <li>Partner 3</li>
        </ul>

        <ul className={styles.links}>
          <li><a onClick={() => this.toggleFooter()}>Show Footer</a></li>
          <li>CARTO</li>
          <li>Map data ©2016 Google, INEGI</li>
          <li>Terms of Use</li>
        </ul>
      </footer>
    );
  }
}

export default FooterMini;
