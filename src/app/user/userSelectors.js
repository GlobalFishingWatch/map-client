import { createSelector } from 'reselect'
import { USER_PERMISSIONS } from 'app/constants'

const getEmbedded = (state) => state.app.isEmbedded
const getUserPermissions = (state) => state.user.userPermissions

export const hasUserActionPermission = (action) =>
  createSelector(
    [getUserPermissions],
    (userPermissions) => {
      return userPermissions !== null && userPermissions.indexOf(action) !== -1
    }
  )

export const canShareWorkspaces = createSelector(
  [getEmbedded, hasUserActionPermission(USER_PERMISSIONS.shareWorkspace)],
  (isEmbedded, shareWorkspace) => {
    return !isEmbedded && shareWorkspace
  }
)
