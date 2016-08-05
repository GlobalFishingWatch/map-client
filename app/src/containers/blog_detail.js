import { connect } from 'react-redux';
import BlogDetail from '../components/blog_detail';
import { getPostBySlug } from '../actions/blog';

const mapStateToProps = (state) => ({
  post: state.blog.post
});

const mapDispatchToProps = (dispatch) => ({
  getPostBySlug: (slug) => dispatch(getPostBySlug(slug))
});
export default connect(mapStateToProps, mapDispatchToProps)(BlogDetail);
