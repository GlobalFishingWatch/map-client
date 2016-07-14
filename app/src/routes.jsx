import React, {Component} from "react";
import AppContainer from "./containers/app";
import HomeContainer from "./containers/home";
import {Router, Route} from "react-router";

class Routes extends Component {
  render() {
    return <Router history={this.props.history}>
      <Route path="/map" component={AppContainer}/>
      <Route path="/" component={HomeContainer}/>
    </Router>;
  }
}


export default Routes;
