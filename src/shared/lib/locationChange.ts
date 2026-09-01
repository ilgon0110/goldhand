export const locationChangeEvent = 'goldhand:locationchange';

export const notifyLocationChange = () => {
  window.dispatchEvent(new Event(locationChangeEvent));
};
