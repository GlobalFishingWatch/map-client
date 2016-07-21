'use strict';

import React, {Component} from "react";
import button_box_slider from "../../../styles/components/c_box_triangle.scss";
import cover_page from "../../../styles/components/c_cover_page.scss";

class ButtonBoxSlider extends Component {

  render() {
    return <div>
      <svg width="12" height="12" className={cover_page.selected_box} onClick={this.changeslide}>
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
