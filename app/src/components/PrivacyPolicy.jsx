import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import AppStyles from '../../styles/application.scss';
import TextPages from '../../styles/components/c-text-pages.scss';
import privacyPolicyBackgroundImage from '../../assets/images/privacy_policy.png';

class PrivacyPolicy extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Privacy Policy"
        subtitle=""
        backgroundImage={privacyPolicyBackgroundImage}
        attribution="© OCEANA / Keith Ellenbogen"
      />
      <div className={StaticPageStyles['l-static-page']}>
        <div className={AppStyles.wrap}>
          <section className={TextPages['c-text-pages']}>
            <article>
              <p>Last Modified: April 18, 2016</p>
              <p>
                Thank you for exploring the Global Fishing Watch Beta release. SkyTruth respects your privacy
                rights and recognizes the importance of protecting the information we collect about you.
                This policy statement tells you how we collect information from you and how we use it.
              </p>
              <p>
                Personal Information Defined. SkyTruth considers “Personal Information”
                to include information that alone or when in combination with
                other information may be used to readily identify, contact or locate
                you, such as: name, address, email address or phone number. SkyTruth
                does not consider Personal Information to include information that has been
                anonymized so that it does not allow a third party to easily identify a specific individual.
              </p>
              <p>
                You have voluntarily established a business relationship with SkyTruth.
                As part of that relationship, you have shared certain Personal Information,
                including your email address. As part of your participation in evaluating this
                Beta release, SkyTruth will only collect further Personal Information from you
                when you voluntarily:
              </p>
              <ul className={TextPages['second-level-list']}>
                <li><p>submit feedback and comments;</p></li>
                <li><p>complete surveys; or</p></li>
                <li><p>sign up for our newsletter.</p></li>
              </ul>
              <p>
                When you submit Personal Information under
                these circumstances, you will receive a confirmation email that will
                give you the option of choosing not to receive further emails from us.
              </p>
              <p>
                SkyTruth may also collect demographic information from visitors, such as geographic location or what
                platforms you own. This information helps us to improve our online offerings and allows
                us to tailor information to your preferences.
              </p>
              <h2>USAGE TRACKING</h2>
              <p>
                We track website usage data to improve our website. We collect user traffic patterns throughout
                our website using web logs, cookies and similar technologies. This information is collected to
                help improve website flow and usability. In addition, when we send emails to our members and supporters,
                we track information on clicks-through to our website, including IP addresses. This is done to
                gauge the effectiveness of our marketing campaigns and to discourage fraudulent use.
              </p>
              <h2>COOKIES</h2>
              <p>
                We may place a text file called a “cookie” in the browser files of your computer.
                The cookie itself does not contain Personal Information, although it will enable
                us to relate your use of this website to information that you have specifically and
                knowingly provided. But the only Personal Information a cookie can contain is
                information you supply yourself. A cookie cannot read data off your hard disk or
                read cookie files created by other websites. SkyTruth may use cookies to track user
                traffic patterns (as described above). In addition, SkyTruth uses encrypted cookies
                to authenticate the user on each page after the user logs onto the website. You can
                refuse cookies by turning them off in your browser. If you have set your browser
                to warn you before accepting cookies, you will receive the warning message with each
                cookie. Some SkyTruth website features and services may not function properly if your
                cookies are disabled.
              </p>
              <h2>
                CHILDREN
              </h2>
              <p>
                This website is not intended for children under 13 years of age and SkyTruth
                does not knowingly collect, maintain or use any Personal Information from
                children under 13 years of age. If we become aware that we have collected
                any Personal Information from children under 13, we will promptly delete
                such information from our databases. If you are a parent or guardian and
                discover that your child under the age of
                13 has used the website, then you may alert us at info@globalfishingwatch.org
                and request that we delete that child’s Personal Information from our systems.
              </p>
              <h2>USER ACCESS</h2>
              <p>
                We make a good faith effort to provide you with access to your Personal
                Information to correct data that may be inaccurate or delete data
                at your request. If you would like to review the information in
                our files, correct it, or ask SkyTruth to refrain from sending
                you information in the future, please contact us by e-mail at
                info@skytruth.org, by calling Teri Biebel at (304) 885-4581,
                or by writing to the postal address listed below. We may decline
                to process requests that are unreasonably repetitive or systematic,
                require disproportionate technical effort, jeopardize the privacy of
                others, would be extremely impractical, or where information is
                required to be retained by law or for legitimate business purposes.
              </p>
              <h2>DATA TRANSFER AND SHARING</h2>
              <p>
                SkyTruth does not rent, sell or share Personal Information
                collected on this website with third parties except as
                follows. We may share user information with our Global
                Fishing Watch founding partners Oceana Inc. and Google
                Inc., subject to their respective privacy policies, which
                can be found at <a className={AppStyles['-underline']} href="http://oceana.org/privacy-policy">
                Oceana</a> and <a
                  className={AppStyles['-underline']}
                  href="https://www.google.com/intl/en/policies/privacy/"
                >
                Google Policies</a>. SkyTruth may provide Personal Information to or permit access to Personal
                Information by vendors and service providers who are contracted
                to help us administer this website. These service providers may
                process Personal Information on our behalf or use Personal
                Information to assist SkyTruth in administering this website.
                We may also disclose user information in special cases when we
                have reason to believe that disclosing this information is necessary
                to identify, contact or bring legal action against someone who may
                be causing injury to or interference with (either intentionally or
                unintentionally) SkyTruth’s rights or property, other SkyTruth
              </p>
              <h2>REORGANIZATION OF SKYTRUTH</h2>
              <p>
                If SkyTruth should ever file for bankruptcy or have its
                assets sold to or merged with
                another entity, information SkyTruth receives from you shall be treated
                as a SkyTruth asset and may be transferred as part of any such transactions.
              </p>
              <h2>AFFILIATED WEBSITES, OTHER WEBSITES, AND ADVERTISEMENTS</h2>
              <p>
                This Privacy Policy applies to websites and services that
                are owned and operated by SkyTruth. We do not exercise
                control over the websites of third parties that you may
                link to or view as part of a frame on a page on this website.
                These other sites may place their own cookies or other files on
                your computer, collect data, or solicit Personal Information
                from you. We are not responsible for the actions or policies
                of such third parties.
                You should check the applicable privacy policies of
                those third parties when providing information on a
                feature or page operated by a third party.
              </p>
              <h2>INTERNATIONAL VISITORS AND CUSTOMERS</h2>
              <p>
                By choosing to visit the website or otherwise provide information to SkyTruth,
                you agree that any dispute over privacy or the terms contained in this Privacy
                Policy will be governed by the law of Virginia.
                This website is hosted in the United States. If you are visiting from the
                European Union or other regions with laws governing data
                collection and use that may differ from U.S. law please
                note that you are transferring your personal data to the
                United States, a country which does not have the same data
                protection laws as the EU, and by providing your personal
                data you consent to:
                the use of your personal data for the uses identified above
                in accordance with this Privacy Policy; and the transfer of
                your personal data to the United States as indicated above.
              </p>
              <h2>SECURITY</h2>
              <p>
                We take steps to ensure that your information is treated securely and in
                accordance with this Privacy Policy. No data transmissions over
                the Internet can be guaranteed to be completely secure.
                Consequently, we cannot ensure or warrant the security of
                any information you transmit to us and you do so at your own
                risk. Once we receive your transmission, we make reasonable
                efforts to ensure security on our systems.
                If SkyTruth learns of a security systems breach we may attempt
                to notify you electronically so that you can take appropriate
                protective steps. By using this website or providing Personal
                Information to us you agree that we can communicate with you
                electronically regarding security, privacy and administrative
                issues relating to your use of this website. SkyTruth may post
                a notice on our website if a security breach occurs. SkyTruth
                may also send an email to you at the email address you have provided
                to us in these circumstances. Depending on where you live, you may
                have a legal right to receive notice of a security breach in writing.
                To receive free written notice of a security breach (or to withdraw
                your consent from receiving electronic notice) you should notify us
                at <a className={AppStyles['-underline']} href="mailto:info@skytruth.org">info@skytruth.org</a>.
              </p>
              <h2>CHANGES AND UPDATES</h2>
              <p>
                We may occasionally update this Privacy Policy. When we do, we will also revise
                the “effective date” on the Privacy Policy. For changes to this Privacy Policy
                that may be materially less restrictive on our use or disclosure of Personal
                Information you have provided to us, we will attempt to obtain your consent
                before implementing the change. We encourage you to periodically review this
                Privacy Policy to stay informed about how we are protecting
                the Personal Information we collect. Your continued use of this website
                constitutes your agreement to this Privacy Policy and any updates.
              </p>
              <h2>CONTACTING SKYTRUTH</h2>
              <p>
                If you have any questions, comments or concerns about SkyTruth or
                this Privacy Policy, please email us at <a
                  className={AppStyles['-underline']}
                  href="mailto:info@skytruth.org"
                >
                info@skytruth.org</a>. In the event
                that we are still unable to resolve your concerns, SkyTruth is committed to
                cooperating to achieve a proper resolution of your privacy concerns.
                <address>
                  Postal Mail Address:<br />
                  SkyTruth <br />
                  P.O. Box 3283 <br />
                  Shepherdstown, WV 25443-3283
                </address>
              </p>
              <h2>YOUR ACCEPTANCE OF THESE TERMS</h2>
              <p>
                By using this site, you signify your assent to this Privacy Policy.
                Your continued use of the sites following the posting of changes
                to these terms will mean you accept those changes.
              </p>
            </article>
          </section>
        </div>
      </div>
      <Footer />
    </div>);
  }

}

export default PrivacyPolicy;
