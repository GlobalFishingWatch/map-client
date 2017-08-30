import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CarouselStyles from 'styles/components/shared/carousel.scss';

function CarouselHeader({ menuName, openMenu, expandState }) {
  const expandName = menuName.toUpperCase().replace(/ /g, '_');
  return (
    <div className={CarouselStyles.carouselHeader} onClick={() => openMenu(expandName)}>
      <div className={CarouselStyles.title} >
        {menuName}
      </div >
      <div
        className={classnames(
          CarouselStyles.expandArrowButton,
          { [CarouselStyles.expanded]: expandName === expandState }
        )}
      />
    </div >
  );
}

CarouselHeader.propTypes = {
  menuName: PropTypes.string.isRequired,
  expandState: PropTypes.string,
  openMenu: PropTypes.func.isRequired
};

export default CarouselHeader;
