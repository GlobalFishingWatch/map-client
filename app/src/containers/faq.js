import { connect } from 'react-redux';
import FAQ from '../components/faq';
import { getFAQEntries } from '../actions/faq';

const mapStateToProps = (state) => ({
  faqEntries: state.faqEntries
});

const mapDispatchToProps = (dispatch) => ({
  getFAQEntries: () => dispatch(getFAQEntries())
});

export default connect(mapStateToProps, mapDispatchToProps)(FAQ);
