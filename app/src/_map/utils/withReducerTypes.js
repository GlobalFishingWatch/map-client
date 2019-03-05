import PropTypes from 'prop-types';

const withReducerPropTypes = (name, propTypesSchema) => (reducer) => {
  if (process.env.NODE_ENV === 'development') {
    return (state, action) => {
      const result = reducer(state, action);
      PropTypes.checkPropTypes(propTypesSchema, result, 'reducer', name);

      return result;
    };
  }
  return reducer;
};

export default withReducerPropTypes;
