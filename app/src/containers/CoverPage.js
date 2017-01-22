import { connect } from 'react-redux';
import CoverPage from 'components/Home/CoverPage';
import { getCoverPageEntries } from 'actions/coverPage';

const mapStateToProps = state => ({
  coverPageEntries: state.coverPageEntries
});

const mapDispatchToProps = dispatch => ({
  getCoverPageEntries: () => dispatch(getCoverPageEntries())
});

export default connect(mapStateToProps, mapDispatchToProps)(CoverPage);
