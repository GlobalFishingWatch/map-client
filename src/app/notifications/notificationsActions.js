import platform from 'platform'
import { getURLParameterByName, getURLPieceByName } from 'app/utils/getURLParameterByName'
export const SET_NOTIFICATION = 'SET_NOTIFICATION'

const workspaceId = getURLParameterByName('workspace') || getURLPieceByName('workspace')

const getNotificationsConfig = (literals) => [
  {
    id: 'sunsetting_map2_migrated',
    content: literals.sunsetting_map2_migrated,
    checker: () => {
      return [
        /* whitelist of GFW migrated workspaces? */
      ].includes(workspaceId)
    },
    type: 'warning',
  },
  {
    id: 'sunsetting_map2_not_migrated',
    content: literals.sunsetting_map2_not_migrated,
    checker: () => {
      return workspaceId.match(/^udw/) === null
    },
    type: 'warning',
  },
  {
    id: 'sunsetting_map2_user_defined',
    content: literals.sunsetting_map2_user_defined,
    checker: () => {
      return workspaceId.match(/^udw/) !== null
    },
    type: 'warning',
  },
  {
    id: 'sunsetting_map2',
    content: literals.sunsetting_map2,
    checker: () => true,
    type: 'warning',
  },
  {
    id: 'banner',
    content: literals.banner,
    checker: () => process.env.REACT_APP_SHOW_BANNER === true,
    type: 'notification',
  },
  {
    id: 'edge',
    content: literals.edge_warning,
    checker: () => platform.name.match(/edge/gi) !== null,
    type: 'warning',
  },
]

const checkIfNotificationNeeded = (config) => {
  for (let i = 0; i < config.length; i++) {
    const element = config[i]
    if (element.checker()) {
      return element
    }
  }
  return null
}

export const resetNotification = () => ({
  type: SET_NOTIFICATION,
  payload: {
    visible: false,
    content: '',
    type: 'notification',
  },
})

export const setNotification = (payload) => ({
  type: SET_NOTIFICATION,
  payload,
})

export const checkInitialNotification = () => (dispatch, getState) => {
  const { literals } = getState()
  const notificationsConfig = getNotificationsConfig(literals)
  const initialNotification = checkIfNotificationNeeded(notificationsConfig)
  if (initialNotification) {
    const { content, type } = initialNotification
    dispatch(setNotification({ content, type, visible: true }))
  }
}
