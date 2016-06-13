'use strict';

import {connect} from 'react-redux';
import App from '../components/App';

const mapStateToProps = (state) => {
  return {
    loading: state.vessel.loading
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
