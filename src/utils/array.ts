export const getValueIndex = <T>(array: T[], elt: T): number => {
  return array.findIndex((v) => v == elt);
};

export const removeElementToIndex = <T>(array: T[], index: number) => {
  const arrayToUpdate = [...array];
  arrayToUpdate.splice(index, 1);
  return arrayToUpdate;
};

export const addElementToIndex = <T>(array: T[], elt: T, index: number) => {
  const arrayToUpdate = [...array];
  arrayToUpdate.splice(index, 0, elt);
  return arrayToUpdate;
};

export const moveEltToIndex = <T>(
  array: T[],
  fromIndex: number,
  toIndex: number
) => {
  const arrayToUpdate = [...array];
  const elt = arrayToUpdate[fromIndex];
  arrayToUpdate.splice(fromIndex, 1);
  arrayToUpdate.splice(toIndex, 0, elt);
  return arrayToUpdate;
};

export const moveValueToIndex = <T>(
  array: T[],
  value: T,
  toIndex: number
): T[] => {
  const valueIndex = getValueIndex(array, value);

  if (valueIndex === -1) {
    return array;
  }

  return moveEltToIndex(array, valueIndex, toIndex);
};
