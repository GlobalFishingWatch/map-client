import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import ga from 'ga-react-router';
import _ from 'lodash';
import Promise from 'promise-polyfill';
import Routes from './routes';
import mapReducer from 'reducers/map';
import faqReducer from 'reducers/faq';
import coverPageReducer from 'reducers/coverPage';
import definitionReducer from 'reducers/definitions';
import userReducer from 'reducers/user';
import filtersReducer from 'reducers/filters';
import 'styles/global.scss';
import contactReducer from 'reducers/contact';
import searchReducer from 'reducers/search';
import vesselInfoReducer from 'reducers/vesselInfo';
import articlesPublicationsReducer from 'reducers/articlesPublications';
import reportReducer from 'reducers/report';
import heatmapReducer from 'reducers/heatmap';
import layerLibraryReducer from 'reducers/layersLibrary';
import layersReducer from 'reducers/layers';

// Polyfill for older browsers (IE11 for example)
window.Promise = window.Promise || Promise;

/**
 * Reducers
 * @info(http://redux.js.org/docs/basics/Reducers.html)
 * @type {Object}
 */
const reducer = combineReducers({
  routing: routerReducer,
  map: mapReducer,
  user: userReducer,
  filters: filtersReducer,
  faqEntries: faqReducer,
  coverPageEntries: coverPageReducer,
  contactStatus: contactReducer,
  search: searchReducer,
  vesselInfo: vesselInfoReducer,
  definitions: definitionReducer,
  articlesPublications: articlesPublicationsReducer,
  report: reportReducer,
  heatmap: heatmapReducer,
  layerLibrary: layerLibraryReducer,
  layers: layersReducer
});


const middlewareRouter = routerMiddleware(browserHistory);

/**
 * Global state
 * @info(http://redux.js.org/docs/basics/Store.html)
 * @type {Object}
 */
const store = createStore(
  reducer,
  applyMiddleware(middlewareRouter),
  applyMiddleware(thunk)
);

/**
 * HTML5 History API managed by React Router module
 * @info(https://github.com/reactjs/react-router/tree/master/docs)
 * @type {Object}
 */
const history = syncHistoryWithStore(browserHistory, store);

history.listen(location => {
  // google analytics
  ga('set', 'page', location.pathname);
  ga('send', 'pageview');

  // SF Pardot
  const absoluteURL = `http://globalfishingwatch.org${location.pathname}`;
  if (window.piTracker) {
    window.piTracker(absoluteURL);
  }

  // attach page name to title
  const title = ['Global Fishing Watch'];
  const pageTitle = _.capitalize(location.pathname.replace('/', '').replace('-', ' '));
  if (pageTitle !== '') title.push(pageTitle);
  document.title = title.join(' - ');
});

render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('app')
);
