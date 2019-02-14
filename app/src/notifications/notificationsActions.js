export const SET_NOTIFICATION = 'SET_NOTIFICATION';

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
