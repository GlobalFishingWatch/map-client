import React, { Component } from 'react';
import { useScroll } from 'react-router-scroll';
import AppContainer from 'containers/App';
import AuthMapContainer from 'containers/AuthMap';
import { Router, Route, IndexRoute, applyRouterMiddleware } from 'react-router';
import NotFoundPage from 'components/Shared/NotFoundPage';

/**
 * Return whether the page should be scrolled to top when
 * routing from one to another
 *
 * @param {Object} prevRouterProps
 * @param {Object} { location }
 * @returns {Boolean}
 */
function shouldUpdateScroll(prevRouterProps, { location }) {
  /**
   * Return whether the two pages match the regex and have the same matching
   * regex parameters
   * @param  {regex}  regex
   * @return {Boolean}
   */
  function isSamePage(regex) {
    const pathname = (prevRouterProps && prevRouterProps.location.pathname) || '';
    const nextPathname = location.pathname;

    /* We first check if the pages are concerned by the regex. If not, the route
     * isn't matching */
    const isPathnameConcerned = regex.test(pathname);
    const isNextPathnameConcerned = regex.test(nextPathname);

    if (!isPathnameConcerned || !isNextPathnameConcerned) {
      return false;
    }

    /* We then get the matching regex params and return false if there isn't
     * any */
    const routeParams = pathname.match(regex);
    const nextRouteParams = nextPathname.match(regex);

    if (!routeParams || !nextRouteParams) {
      return false;
    }

    /* We remove the first element of the arrays as it is the whole matched
     * string (i.e. the route) */
    if (routeParams.length) {
      routeParams.splice(0, 1);
    }
    if (nextRouteParams.length) {
      nextRouteParams.splice(0, 1);
    }

    const paramsCount = Math.min(routeParams.length, nextRouteParams.length);

    let doesParamsMatch = true;
    for (let i = 0, j = paramsCount; i < j; i++) {
      if (routeParams[i] !== nextRouteParams[i]) {
        doesParamsMatch = false;
        break;
      }
    }

    return doesParamsMatch;
  }

  /* Here we define all the routes for which we don't want to scroll to top if
   * both the old path and the new one match (i.e. if the global regex and the
   * regex params match the two paths) */
  const regexes = [
    /\/definitions(?:\/(?:[A-z]|[1-9]|-)+)?/
  ];

  for (let i = 0, j = regexes.length; i < j; i++) {
    if (isSamePage(regexes[i])) {
      return false;
    }
  }

  return true;
}

class Routes extends Component {
  render() {
    return (
      <Router
        history={this.props.history}
        render={applyRouterMiddleware(useScroll(shouldUpdateScroll))}
      >
        <Route path="/" component={AppContainer}>
          <IndexRoute component={AuthMapContainer} />

          <Route path="*" component={NotFoundPage} />
        </Route>
      </Router>
    );
  }
}

Routes.propTypes = {
  history: React.PropTypes.any
};

export default Routes;
