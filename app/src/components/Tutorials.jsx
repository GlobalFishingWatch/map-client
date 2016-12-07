import React, { Component } from 'react';
import classnames from 'classnames';
import CoverPrimary from 'components/Shared/CoverPrimary';
import Footer from 'components/Shared/Footer';
import StaticPageStyles from 'styles/layout/l-static-page.scss';
import baseStyle from 'styles/_base.scss';
import tutorialBackgroundImage from 'assets/images/tutorial.jpg';

class Tutorials extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Watch Our Tutorial"
        subtitle="View our tutorial video to see Global Fishing Watch in action."
        backgroundImage={tutorialBackgroundImage}
        attribution="© OCEANA / Juan Cuetos"
      />
      <div className={classnames(StaticPageStyles['l-static-page'], StaticPageStyles['-tutorials'])}>
        <div className={baseStyle.wrap}>
          <section>
            <p>Click on the video below to watch a brief tutorial of how Global Fishing Watch works. </p>
            <div className={StaticPageStyles['video-container']}>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/JrnZbx12FpQ"
                frameBorder="0"
                allowFullScreen
              >
              </iframe>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>);
  }
}

export default Tutorials;
