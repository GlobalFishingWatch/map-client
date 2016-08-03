export default (oldExtent, newExtent) =>
  oldExtent[0].getTime() !== newExtent[0].getTime() ||
  oldExtent[1].getTime() !== newExtent[1].getTime();
