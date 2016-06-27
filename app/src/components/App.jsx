'use strict';

import React, {Component} from 'react';
import Map from '../containers/map';

class App extends Component {

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
