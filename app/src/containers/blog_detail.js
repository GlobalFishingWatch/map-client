'use strict';

import {connect} from "react-redux";
import BlogDetail from "../components/blog_detail";
import {getPostById} from "../actions/blog";

const mapStateToProps = (state) => {
  return {
    post: state.blog.post
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPostById: (id) => dispatch(getPostById(id))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BlogDetail);
