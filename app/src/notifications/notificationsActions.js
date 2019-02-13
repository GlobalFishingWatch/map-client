export const SHOW_BANNER = 'SHOW_BANNER';

export function setNotification(payload) {
  return {
    type: SHOW_BANNER,
    payload
  };
}
