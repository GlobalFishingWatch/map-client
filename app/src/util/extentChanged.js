export default (oldExtent, newExtent) => {
  if (!oldExtent && !newExtent) {
    return false;
  }
  if (!oldExtent && newExtent || oldExtent && !newExtent) {
    return true;
  }
  return (oldExtent[0].getTime() !== newExtent[0].getTime() || oldExtent[1].getTime() !== newExtent[1].getTime());
};
