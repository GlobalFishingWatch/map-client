export default (vesselData, vesselFields) => {
  const vesselFieldPriorities = vesselFields
    .filter(v => v.titlePriority !== undefined)
    .sort(
      (a, b) => a.titlePriority > b.titlePriority
    );
  const vesselFieldValues = vesselFieldPriorities.map(v => vesselData[v.id]);

  const vesselLabel = vesselFieldValues.find(t => t !== undefined && t !== '');

  return vesselLabel === undefined ? '' : vesselLabel.toString();
};
