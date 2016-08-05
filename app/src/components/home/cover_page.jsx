import React, { Component } from 'react';
import $ from 'jquery';
import Slider from 'react-slick';
import ButtonBoxSlider from './button_box_slider';
import CoverPageStyle from '../../../styles/components/c-cover-page.scss';
import BoxTriangleStyle from '../../../styles/components/c-box-triangle.scss';

class CoverPage extends Component {
  gosection() {
    $('html, body').animate({
      scrollTop: $('#case_study').offset().top
    }, 1000);
  }

  alerte(){
    alert("d");
  }

  render() {
    return (
      <div className={CoverPageStyle['c-cover-page']}>
        <div>
          <Slider
            dots
            dotsClass={CoverPageStyle['dots-cover']}
            arrows={false}
            draggable={false}
            infinite
            speed={500}
            fade
          >
            <div>
              <h1>
                The first global view of commercial fishing activity
              </h1>
              <p>Global Fishing Watch, a partnership of Oceana, SkyTruth and Google, enables anyone with an Internet
                connection to see global fishing activity worldwide in near real-time
                - for free. It s a powerful tool that
                will hold our leaders accountable for maintaining abundant oceans and show consumers
                where - - and by whom -- their fish is being caught.
              </p>
            </div>
            <div>
              <h1>
                The second global view of commercial fishing activity
              </h1>
              <p>Global Fishing Watch, a partnership of Oceana, SkyTruth and Google, enables anyone with an Internet
                connection to see global fishing activity worldwide in near real-time
                - for free. It s a powerful tool that
                will hold our leaders accountable for maintaining abundant oceans and show consumers
                where - - and by whom -- their fish is being caught.
              </p>
            </div>
          </Slider>
          <div className={CoverPageStyle['footer-header']}>
            <ButtonBoxSlider />
            <div className={BoxTriangleStyle['c-box-triangle']} onClick={this.gosection}>
              <div className={BoxTriangleStyle['triangle-min']}></div>
            </div>
            <div>Brought to you by:</div>
          </div>
        </div>
      </div>
    );
  }
}

export default CoverPage;
