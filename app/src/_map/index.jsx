import React from 'react';
// import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
// import Promise from 'promise-polyfill';

import testReducer from './reducers/mapTestReducer';
import MapProxy from './MapProxyContainer';


// export default (props) => {
//   // Hook here workspace diffing? (ie dispatch action that redispatches depending on updated parts of workspace)
//   // console.log(props)
//   return (
//     <Provider store={mapStore} >
//       <Map {...props} />
//     </Provider>
//   );
// };

class MapModule extends React.Component {
  componentWillMount() {
    console.log(this.props);
    console.log(this.props.parentReducer);

    // JUST PREPARE THE REDUCERS IN PARENT INDEX; FOR NOW
    const reducer = combineReducers({
      test: testReducer,
      ...this.props.parentReducer
    });
    
    this.mapStore = createStore(
      reducer,
      applyMiddleware(thunk)
    );
  }
  render() {
    return (
      <Provider parentStore={} store={this.store} >
        <MapProxy {...this.props} />
      </Provider>
    );
  }
}

export default MapModule;
