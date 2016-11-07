export default () => {
  let workspace = null;
  let url = window.location.search;
  url = url.slice(1);

  const splitedParams = url.split('&');

  splitedParams.forEach((p) => {
    const param = p.split('=');

    if (param[0] && param[0] === 'workspace') {
      workspace = param[1];
      return;
    }
  });

  return workspace;
};
