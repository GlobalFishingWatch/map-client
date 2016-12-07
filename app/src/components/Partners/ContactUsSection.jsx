import React, { Component } from 'react';
import { Link } from 'react-router';
import BaseStyle from 'styles/_base.scss';
import style from 'styles/components/c-partners-contact-us.scss';

class OtherSection extends Component {

  render() {
    return (<section className={style['c-contact-us-section']}>
      <div className={BaseStyle.wrap}>
        If you would like to become involved, please{' '}
        <Link to="contact-us" className="gfw-link">contact us</Link>.
      </div>
    </section>);
  }
}

export default OtherSection;
