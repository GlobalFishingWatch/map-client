'use strict';
import React, {Component} from "react";
import info_map_content from "../../styles/components/c_info_map_content.scss";
import button from "../../styles/components/c_button.scss";
import boxtrianglewhite from "../../assets/icons/box_triangle_white.svg";

class InfoMap extends Component {

  render() {
    return <div className={info_map_content.c_info_map_content}>
      <h2>THE MAP</h2>
      <h3>Lorem ipsum dolor sit amet</h3>
      <p>Morbi porttitor massa id bibendum varius. Etiam vitae pulvinar nisi, vel fringilla libero. Nulla consequat sodales lectus.</p>
      <p>
        <a href="map" className={button.c_btn_primary}>
          <img src={boxtrianglewhite}></img>EXPLORE MAP</a>
      </p>
    </div>
  }
}

export default InfoMap;
