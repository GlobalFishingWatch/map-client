import {
  INIT_MODULE,
  START_LOADER,
  COMPLETE_LOADER
} from './module.actions';

const initialState = {
  loaders: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INIT_MODULE: {
      return {
        ...state,
        token: action.payload.token,
        onViewportChange: action.payload.onViewportChange,
        onLoadStart: action.payload.onLoadStart,
        onLoadComplete: action.payload.onLoadComplete
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
}
