'use strict';

import React, {Component} from "react";
import Map from "../containers/map";

class App extends Component {

  componentDidMount() {
    if (this.props.params.accessToken) {
      this.props.setToken(this.props.params.accessToken.split('&state')[0]);
    }
    this.props.getLoggedUser();
  }

  render() {
    return (
      <div>
        {this.props.loading && <div>Loading....</div>}
        <Map></Map>
      </div>
    );
  }

}

export default App;
