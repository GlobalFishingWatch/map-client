import React, { Component } from 'react';
import Slider from 'react-slick';
import SliderCase from '../../../styles/components/c-slider-case.scss';
import LinkBox from '../../../styles/components/c-link-box.scss';
import boxtriangle from '../../../assets/icons/box_triangle.svg';

class CaseStudySlider extends Component {
  render() {
    return (<Slider
      dots={false}
      arrows
      infinite
      speed={500}
      fade
      afterChange={function (event, slick) {
        alert(slick);
      }}
    >
      <div className={SliderCase['c-slider-case']}>
        <div className={SliderCase['c-slider-case-text']}>
          <h2>CASE STUDY</h2>
          <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis orci varius sem posuere tempus.
            Pellentesque enim nulla, consequat vitae faucibus a, vulputate at est. Quisque interdum, ex imperdiet
            feugiat eleifend, dui nibh cursus neque, dapibus fringilla lectus elit eget dolor. Phasellus ut nisl tortor.
            Ut posuere convallis consectetur. Nam.
          </p>
          <p>
            <a className={LinkBox['c-link-box']} href="#">
              <img
                alt="find out more"
                src={boxtriangle}
              />FIND OUT MORE
            </a>
          </p>
        </div>
        <div className={SliderCase['c-slider-case-img']}></div>
      </div>
      <div className={SliderCase['c-slider-case']}>
        <div className={SliderCase['c-slider-case-text']}>
          <h2>CASE STUDY 2</h2>
          <h3>Vix id fabulas commune invidunt, ad his tollit detracto.
          </h3>
          <p>Vix id fabulas commune invidunt, ad his tollit detracto. Mea unum deleniti platonem ne.
            Vidit temporibus voluptatibus his in, tota impetus verterem cum et, nec in oportere vituperata dissentiet.
            Est id ipsum option, no partem interpretaris est. Ad ius quas indoctum, ei usu sumo everti intellegat,
            eos in apeirian contentiones. Ne vel perpetua accusamus, sed feugait noluisse id, vis illum eirmod
          </p>
          <p>
            <a className={LinkBox['c-link-box']} href="#">
              <img
                alt="find out more"
                src={boxtriangle}
              />FIND OUT MORE
            </a>
          </p>
        </div>
        <div className={SliderCase['c-slider-case-img']}></div>
      </div>
    </Slider>);
  }

}

export default CaseStudySlider;
