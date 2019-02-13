export const SET_NOTIFICATION = 'SET_NOTIFICATION';

export function resetNotification() {
  return {
    type: SET_NOTIFICATION,
    payload: {
      visible: false,
      content: '',
      type: 'notification'
    }
  };
}

export function setNotification(payload) {
  return {
    type: SET_NOTIFICATION,
    payload
  };
}
