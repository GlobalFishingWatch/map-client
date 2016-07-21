'use strict';
import React, {Component} from "react";
import gallery from "../../../styles/components/c_gallery_images.scss";
import boxtriangle from "../../../assets/icons/box_triangle.svg";

class SuccessStoryGallery extends Component {

  render() {
    return <div className={gallery.c_gallery_images}>
      <div className={gallery.image_text}>
        <div className={gallery.img}></div>
        <p className={gallery.info_text}>
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
          porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
          <span className={gallery.title_info}><b>Name</b> / Position</span>
          <a className={gallery.link_more} href="#"><img src={boxtriangle}></img>find out more</a>
        </p>
      </div>
      <div className={gallery.image_text}>
        <div className={gallery.img}></div>
        <p className={gallery.info_text}>
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
          porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
          <span className={gallery.title_info}><b>Name</b> / Position</span>
          <a className={gallery.link_more} href="#"><img src={boxtriangle}></img>find out more</a>
        </p>
      </div>
      <div className={gallery.image_text}>
        <div className={gallery.img}></div>
        <p className={gallery.info_text}>
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
          porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
          <span className={gallery.title_info}><b>Name</b> / Position</span>
          <a className={gallery.link_more} href="#"><img src={boxtriangle}></img>find out more</a>
        </p>
      </div>
    </div>
  }
}

export default SuccessStoryGallery;
