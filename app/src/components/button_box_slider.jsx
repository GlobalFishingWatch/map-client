'use strict';

import React, {Component} from "react";
import button_box_slider from "../../styles/components/c_box_triangle.scss";

class ButtonBoxSlider extends Component {

  render() {
    return <div className={button_box_slider.c_button_box_slider}>
      <svg width="12" height="12">
        <rect width="12" height="12"/>
      </svg>
      <svg width="12" height="12">
        <rect width="12" height="12"/>
      </svg>
      <svg width="12" height="12">
        <rect width="12" height="12"/>
      </svg>
      <svg width="12" height="12">
        <rect width="12" height="12"/>
      </svg>
      <svg width="12" height="12">
        <rect width="12" height="12"/>
      </svg>
    </div>

  }

}

export default ButtonBoxSlider;
