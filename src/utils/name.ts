export const getImageName = (id: `${string}-${string}`): string =>
  id.split('-')[0];
