import React from 'react';
// import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
// import Promise from 'promise-polyfill';

import testReducer from './reducers/mapTestReducer';
import Map from './containers/Map';

const reducer = combineReducers({
  test: testReducer
});

const mapStore = createStore(
  reducer,
  applyMiddleware(thunk)
);

export default (props) => {
  // Hook here workspace diffing? (ie dispatch action that redispatches depending on updated parts of workspace)
  // console.log(props)
  return (
    <Provider store={mapStore} >
      <Map {...props} />
    </Provider>
  );
};
