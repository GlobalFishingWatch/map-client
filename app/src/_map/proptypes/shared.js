import PropTypes from 'prop-types';

export const popupTypes = {
  content: PropTypes.node,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired
};

export const viewportTypes = {
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number)
};
