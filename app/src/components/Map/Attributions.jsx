import PropTypes from 'prop-types';
import React from 'preact';
import classnames from 'classnames';
import mapCss from 'styles/components/c-map.scss';

function Attributions({ isEmbedded }) {
  return (
    <div
      className={classnames(mapCss['attributions-container'], {
        [mapCss['-embed']]: isEmbedded
      })}
    >
      <span className={mapCss['mobile-map-attributions']}>

        <a
          className={mapCss.link}
          href="https://carto.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CARTO
        </a>
        {' '} Map data ©2016 Google, INEGI Imagery ©2016 NASA, TerraMetrics, EEZs:{' '}
        <a
          className={mapCss.link}
          href="http://marineregions.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          marineregions.org
        </a>, MPAs:{' '}
        <a
          className={mapCss.link}
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
