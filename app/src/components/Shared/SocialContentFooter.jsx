import React, { Component } from 'react';
import SocialFooterStyle from '../../../styles/components/c-footer.scss';
import iconFacebook from '../../../assets/icons/facebook.svg';
import iconTwitter from '../../../assets/icons/twitter.svg';
import SubscribeSVG from '../../../assets/icons/subscribe.svg';

class SocialFooter extends Component {

  render() {
    return (
      <div className={SocialFooterStyle['social-section']}>
        <a
          className={SocialFooterStyle['subscribe-button']}
          href="http://info.globalfishingwatch.org/catch_signup"
          target="_blank"
        >
          SIGN UP FOR EMAIL UPDATES!
          <img
            className={SocialFooterStyle['email-subscribe']}
            src={SubscribeSVG} alt="subscribe news"
          />
        </a>

        <div className={SocialFooterStyle['social-links']}>
          <span className={SocialFooterStyle['social-text']}>Follow us</span>
          <ul className={SocialFooterStyle['social-list']}>
            <li className={SocialFooterStyle['social-item']}>
              <a href="https://twitter.com/globalfishwatch" target="_blank">
                <img src={iconTwitter} alt="Global Fishing Watch Twitter" />
              </a>
            </li>
            <li className={SocialFooterStyle['social-item']}>
              <a href="https://www.facebook.com/GlobalFishingWatch/" target="_blank">
                <img src={iconFacebook} alt="Global Fishing Watch Facebook" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default SocialFooter;
