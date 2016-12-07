import React, { Component } from 'react';
import gallery from 'styles/components/c-gallery-images.scss';
import boxtriangle from 'assets/icons/box_triangle.svg';

class SuccessStoryGallery extends Component {

  render() {
    return (<div className={gallery['c-gallery-images']}>
      <div className={gallery['image-text']}>
        <div className={gallery.img}></div>
        <p className={gallery['info-text']}>
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
          porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
          <span className={gallery['title-info']}><b>Name</b> / Position</span>
          <a className={gallery['link-more']} href="#"><img src={boxtriangle} alt="Find out more" />find out more</a>
        </p>
      </div>
      <div className={gallery['image-text']}>
        <div className={gallery.img}></div>
        <p className={gallery['info-text']}>
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
          porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
          <span className={gallery['title-info']}><b>Name</b> / Position</span>
          <a className={gallery['link-more']} href="#"><img src={boxtriangle} alt="Find out more" />find out more</a>
        </p>
      </div>
      <div className={gallery['image-text']}>
        <div className={gallery.img}></div>
        <p className={gallery['info-text']}>
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
          porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
          <span className={gallery['title-info']}><b>Name</b> / Position</span>
          <a className={gallery['link-more']} href="#"><img src={boxtriangle} alt="Find out more" />find out more</a>
        </p>
      </div>
    </div>);
  }
}

export default SuccessStoryGallery;
