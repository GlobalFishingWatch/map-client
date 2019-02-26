import PropTypes from 'prop-types';
import withReducerTypes from '../utils/withReducerTypes';
import { INIT_MODULE, START_LOADER, COMPLETE_LOADER } from './module.actions';

const initialState = {
  loaders: null,
  token: undefined,
  onViewportChange: undefined,
  onHover: undefined,
  onClick: undefined,
  onLoadStart: undefined,
  onLoadComplete: undefined,
  onClosePopup: undefined,
  onAttributionsChange: undefined
};

const moduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_MODULE: {
      return {
        ...state,
        ...action.payload
      };
    }

    case START_LOADER: {
      const loaders = [...state.loaders];
      loaders.push(action.payload);
      return { ...state, loaders };
    }

    case COMPLETE_LOADER: {
      const loaders = [...state.loaders];
      const loaderIndex = loaders.findIndex(l => l === action.payload);
      loaders.splice(loaderIndex, 1);
      return { ...state, loaders };
    }

    default:
      return state;
  }
};

const moduleTypes = PropTypes.exact({
  loaders: PropTypes.arrayOf(PropTypes.number),
  token: PropTypes.string,
  onViewportChange: PropTypes.func,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadComplete: PropTypes.func,
  onClosePopup: PropTypes.func,
  onAttributionsChange: PropTypes.func
});

export default withReducerTypes('module', moduleTypes)(moduleReducer);
