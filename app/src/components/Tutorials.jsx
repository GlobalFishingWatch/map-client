import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import baseStyle from '../../styles/_base.scss';
import tutorialStyle from '../../styles/components/c-tutorial-page.scss';
import tutorialBackgroundImage from '../../assets/images/tutorial.png';

class Tutorials extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Watch Our Tutorial"
        subtitle="View our tutorial video to see Global Fishing in action."
        backgroundImage={tutorialBackgroundImage}
        attribution="© OCEANA / Juan Cuetos"
      />
      <div className={baseStyle.wrap}>
        <section className={tutorialStyle['c-tutorial-page']}>
          <p>Click on the video below to watch a brief tutorial of how Global Fishing Watch works. </p>
          <div className={tutorialStyle['video-container']}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/sI9OTeTGcrw"
              frameBorder="0"
              allowFullScreen
            >
            </iframe>
          </div>
        </section>
      </div>
      <Footer />
    </div>);
  }
}

export default Tutorials;
