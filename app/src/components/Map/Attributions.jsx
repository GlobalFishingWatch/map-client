import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import MapStyles from 'styles/components/map.scss';

function Attributions({ isEmbedded }) {
  return (
    <div
      className={classnames(MapStyles.attributionsContainer, {
        [MapStyles._embed]: isEmbedded
      })}
    >
      <span className={MapStyles.mobileMapAttributions}>

        <a
          className={MapStyles.link}
          href="https://carto.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CARTO
        </a>
        {' '} Map data ©2016 Google, INEGI Imagery ©2016 NASA, TerraMetrics, EEZs:{' '}
        <a
          className={MapStyles.link}
          href="http://marineregions.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          marineregions.org
        </a>, MPAs:{' '}
        <a
          className={MapStyles.link}
          href="http://mpatlas.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          mpatlas.org
        </a>
      </span>
    </div>
  );
}

Attributions.propTypes = {
  isEmbedded: PropTypes.bool.isRequired
};

export default Attributions;
