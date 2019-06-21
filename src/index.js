import 'react-app-polyfill/ie11'
import React from 'react'
import { render } from 'react-dom'
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import Promise from 'promise-polyfill'
import 'styles/global.module.scss'
import { init } from 'app/app/appActions'
import reducers from 'app/reducers'
import analyticsMiddleware from 'app/analytics/analyticsMiddleware'

import AppContainer from 'app/containers/App'
import AuthMapContainer from 'app/containers/AuthMap'

// IE 11 polyfills
import 'core-js/stable/object/assign'
import 'core-js/stable/object/values'
import 'core-js/stable/array/find'

const { NODE_ENV } = process.env

// Polyfill for older browsers (IE11 for example)
window.Promise = window.Promise || Promise

/**
 * Global state
 * @info(http://redux.js.org/docs/basics/Store.html)
 * @type {Object}
 */
const composeEnhancers =
  NODE_ENV === 'development' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        stateSanitizer: (state) => ({
          ...state,
          tracks: 'NOT_SERIALIZED',
          heatmap: 'NOT_SERIALIZED',
        }),
      })
    : compose

const enhancer = composeEnhancers(applyMiddleware(analyticsMiddleware, thunk))
const store = createStore(combineReducers(reducers), enhancer)

render(
  <Provider store={store}>
    <AppContainer>
      <AuthMapContainer />
    </AppContainer>
  </Provider>,
  document.getElementById('app')
)

store.dispatch(init())

export default store
