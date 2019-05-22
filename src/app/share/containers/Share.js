import { connect } from 'react-redux'
import Share from 'app/share/components/Share'

const mapStateToProps = (state) => ({
  workspaceId: state.workspace.workspaceId,
  error: state.share.shareModal.error,
})

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Share)
