import React from 'react';
// import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
// import Promise from 'promise-polyfill';

import MapProxy from './MapProxy.container';
import { fitBoundsToTrack, incrementZoom as mapIncrementZoom, decrementZoom as mapDecrementZoom } from './glmap/viewport.actions';


// export default (props) => {
//   // Hook here workspace diffing? (ie dispatch action that redispatches depending on updated parts of workspace)
//   // console.log(props)
//   return (
//     <Provider store={mapStore} >
//       <Map {...props} />
//     </Provider>
//   );
// };

let store;


class MapModule extends React.Component {
  // componentWillMount() {
  //   console.log(this.props);
  //   console.log(this.props.parentReducer);

  //   // JUST PREPARE THE REDUCERS IN PARENT INDEX; FOR NOW
  //   const reducer = combineReducers({
  //     test: testReducer,
  //     ...this.props.parentReducer
  //   });
  //   this.mapStore = createStore(
  //     reducer,
  //     applyMiddleware(thunk)
  //   );
  // }
  render() {
    if (this.props.store) {
      store = this.props.store;
      return (
        <Provider store={this.props.store}>
          <MapProxy {...this.props} />
        </Provider>
      );
    }
    return null;
  }
}

export default MapModule;

export const targetMapVessel = (id, segmentId) => {
  const track = store.getState().map.tracks.find(t =>
    t.id === id && (segmentId === undefined || t.segmentId === segmentId)
  );

  store.dispatch(fitBoundsToTrack(track.geoBounds));

  return track.timelineBounds;
};

export const incrementZoom = () => {
  store.dispatch(mapIncrementZoom());
};

export const decrementZoom = () => {
  store.dispatch(mapDecrementZoom());
};
