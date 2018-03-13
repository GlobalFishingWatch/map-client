import template from 'lodash/template';
import templateSettings from 'lodash/templateSettings';

export default (urlTemplate, urlParams) => {
  templateSettings.interpolate = /{{([\s\S]+?)}}/g;
  const urlTemplateCompiled = template(urlTemplate);
  return urlTemplateCompiled(urlParams);
};

