import React, {Component} from "react";
import AppContainer from "./containers/app";
import HomeContainer from "./containers/home";
import MapContainer from "./containers/map";
import NewsContainer from "./containers/news";
import {Router, Route, IndexRoute} from "react-router";

class Routes extends Component {
  render() {
    return <Router history={this.props.history}>
      <Route path="/" component={AppContainer}>
        <Route path="map" component={MapContainer}/>
        <IndexRoute component={HomeContainer}/>
        <Route path="news" component={NewsContainer}/>
      </Route>
    </Router>;
  }
}


export default Routes;
