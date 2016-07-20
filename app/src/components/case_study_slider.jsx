'use strict';

import React, {Component} from "react";
import Slider from "react-slick";
import slider_case from "../../styles/components/c_slider_case.scss";
import link_box from "../../styles/components/c_link_box.scss";
import boxtriangle from "../../assets/icons/box_triangle.svg";

class CaseStudySlider extends Component {

  render() {
    return <Slider
      dots={true}
      arrows={false}
      infinite={ true}
      speed={ 500}
      fade={ true}
    >
      <div className={slider_case.c_slider_case}>
        <div className={slider_case.c_slider_case_text}>
          <h2>CASE STUDY</h2>
          <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis orci varius sem posuere tempus.
            Pellentesque enim nulla, consequat vitae faucibus a, vulputate at est. Quisque interdum, ex imperdiet
            feugiat eleifend, dui nibh cursus neque, dapibus fringilla lectus elit eget dolor. Phasellus ut nisl tortor.
            Ut posuere convallis consectetur. Nam.</p>
          <p>
            <a className={link_box.c_link_box} href="#"><img src={boxtriangle}></img>FIND OUT MORE</a>
          </p>
        </div>
        <div className={slider_case.c_slider_case_img}></div>
      </div>
      <div className={slider_case.c_slider_case}>
        <div className={slider_case.c_slider_case_text}>
          <h2>CASE STUDY 2</h2>
          <h3>Vix id fabulas commune invidunt, ad his tollit detracto.
          </h3>
          <p>Vix id fabulas commune invidunt, ad his tollit detracto. Mea unum deleniti platonem ne.
            Vidit temporibus voluptatibus his in, tota impetus verterem cum et, nec in oportere vituperata dissentiet.
            Est id ipsum option, no partem interpretaris est. Ad ius quas indoctum, ei usu sumo everti intellegat,
            eos in apeirian contentiones. Ne vel perpetua accusamus, sed feugait noluisse id, vis illum eirmod </p>
          <p>
            <a className={link_box.c_link_box} href="#"><img src={boxtriangle}></img>FIND OUT MORE</a>
          </p>
        </div>
        <div className={slider_case.c_slider_case_img}></div>
      </div>
    </Slider>
  }

}

export default CaseStudySlider;
