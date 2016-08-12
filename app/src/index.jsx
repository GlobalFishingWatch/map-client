import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import Routes from './routes';
import '../styles/index.scss';
import mapReducer from './reducers/map';
import faqReducer from './reducers/faq';
import definitionReducer from './reducers/definitions';
import userReducer from './reducers/user';
import blogReducer from './reducers/blog';
import filtersReducer from './reducers/filters';
import '../styles/application.scss';
import appearanceReducer from './reducers/appearance';
import contactReducer from './reducers/contact';
import searchReducer from './reducers/search';
import vesselInfoReducer from './reducers/vesselInfo';
import articlesPublicationsReducer from './reducers/articlesPublications';

/**
 * Reducers
 * @info(http://redux.js.org/docs/basics/Reducers.html)
 * @type {Object}
 */
const reducer = combineReducers({
  routing: routerReducer,
  map: mapReducer,
  user: userReducer,
  blog: blogReducer,
  filters: filtersReducer,
  appearance: appearanceReducer,
  faqEntries: faqReducer,
  contactStatus: contactReducer,
  search: searchReducer,
  vesselInfo: vesselInfoReducer,
  definitions: definitionReducer,
  articlesPublications: articlesPublicationsReducer
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

render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('app')
);
