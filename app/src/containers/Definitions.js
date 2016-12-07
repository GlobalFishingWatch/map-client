import { connect } from 'react-redux';
import Definitions from 'components/Definitions';
import { getDefinitionEntries } from 'actions/definitions';
import { push } from 'react-router-redux';

const mapStateToProps = (state) => ({
  definitionEntries: state.definitions
});

const mapDispatchToProps = (dispatch) => ({
  getDefinitionEntries: () => dispatch(getDefinitionEntries()),
  push: (term) => dispatch(push(`/definitions/${term}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(Definitions);
