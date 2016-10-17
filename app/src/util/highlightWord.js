export default (strReplace, str, styleClass) => {
  const regX = new RegExp(strReplace, 'i');
  const hightlight = `<span class="${styleClass}">${strReplace.toUpperCase()}</span>`;

  return str.replace(regX, hightlight);
};
