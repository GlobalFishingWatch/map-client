'use strict';

import {connect} from "react-redux";
import Blog from "../components/blog";
import {getRecentPost} from "../actions/blog";
import {getPostById} from "../actions/blog";

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

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
