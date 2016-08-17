import React, { Component } from 'react';
import infoWebStyle from '../../../styles/components/c-info-web.scss';
import baseStyle from '../../../styles/application.scss';

class InfoWeb extends Component {
  render() {
    return (
      <section className={baseStyle.wrap}>
        <div className={infoWebStyle['c-info-web']}>
          <div className={infoWebStyle['image-info-web']}></div>
          <div className={infoWebStyle['text-info-web']}>
            <p>
              The Global Fishing Watch Research Program works closely
              with scientific experts to develop the tools and
              analyses that will help us address some of the
              biggest challenges facing the ocean. Our research
              partnerships are helping us improve the accuracy
              of our core algorithms and enabling new discoveries
              that will be critical to ocean conservation. Moreover,
              the Global Fishing Watch aims to support the entire scientific
              community by making many of our datasets publicly available.
            </p>
          </div>
        </div>
      </section>);
  }
}

export default InfoWeb;
