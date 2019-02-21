import * as PIXI from 'pixi.js';
import platform from 'platform';

export const SET_NOTIFICATION = 'SET_NOTIFICATION';

const getNotificationsConfig = literals => ([
  {
    id: 'banner',
    content: literals.banner,
    checker: () => SHOW_BANNER === true,
    type: 'notification'
  },
  {
    id: 'webgl',
    content: literals.webgl_warning,
    checker: () => !PIXI.utils.isWebGLSupported(),
    type: 'error'
  },
  {
    id: 'edge',
    content: literals.edge_warning,
    checker: () => platform.name.match(/edge/gi) !== null,
    type: 'warning'
  }
]);

const checkIfNotificationNeeded = (config) => {
  for (let i = 0; i < config.length; i++) {
    const element = config[i];
    if (element.checker()) {
      return element;
    }
  }
  return null;
};

export const resetNotification = () => ({
  type: SET_NOTIFICATION,
  payload: {
    visible: false,
    content: '',
    type: 'notification'
  }
});

export const setNotification = payload => ({
  type: SET_NOTIFICATION,
  payload
});

export const checkInitialNotification = () => (dispatch, getState) => {
  const { literals } = getState();
  const notificationsConfig = getNotificationsConfig(literals);
  const initialNotification = checkIfNotificationNeeded(notificationsConfig);
  if (initialNotification) {
    const { content, type } = initialNotification;
    dispatch(setNotification({ content, type, visible: true }));
  }
};
