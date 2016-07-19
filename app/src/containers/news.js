'use strict';

import {connect} from "react-redux";
import News from "../components/news";
import {getRecentPost} from "../actions/blog";

const mapStateToProps = (state) => {
  return {
    recentPost: state.blog.recentPost
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRecentPost: () => dispatch(getRecentPost())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(News);
