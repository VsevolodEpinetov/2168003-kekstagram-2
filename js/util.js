import { DEFAULT_DEBOUNCE_DELAY, MILISECONDS_IN_SECOND } from './settings.js';

export const generateUniqueId = () => {
  let currentId = 0;

  return () => {
    currentId++;
    return currentId;
  };
};

export const getRandomPositiveIntFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const getRandomArrayElement = (elements) => elements[Math.floor(Math.random() * elements.length)];

export const arrayHasDuplicates = (elements) => {
  const metElements = {};

  for (let i = 0; i < elements.length; i++) {
    if (metElements[elements[i]]) {
      return true;
    } else {
      metElements[elements[i]] = true;
    }
  }

  return false;
};

export const removeExceedingSpaces = (string) => {
  const regex = /\s{2,}/g;
  return string.trim().replaceAll(regex, ' ');
};

export const shuffleArray = (elements) => {
  const copyArray = elements.slice();
  let amountOfRemaining = copyArray.length;

  while (amountOfRemaining) {
    const randomElement = Math.floor(Math.random() * amountOfRemaining);
    amountOfRemaining--;

    [copyArray[amountOfRemaining], copyArray[randomElement]] = [
      copyArray[randomElement], copyArray[amountOfRemaining]];
  }

  return copyArray;
};

export const debounce = (cb, interval = DEFAULT_DEBOUNCE_DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cb(...rest), interval * MILISECONDS_IN_SECOND);
  };
};
