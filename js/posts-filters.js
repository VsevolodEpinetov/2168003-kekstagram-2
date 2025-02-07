import { displayPosts } from './display-posts.js';
import { AMOUNT_OF_RANDOM_POSTS, RERENDER_DELAY } from './settings.js';
import { debounce, shuffleArray } from './util.js';

export const postFilters = (posts) => {
  const buttons = document.querySelectorAll('.img-filters__button');

  const renderFilteredPosts = (filterType) => {
    let postsCopy = posts.slice();

    switch (filterType) {
      case 'random':
        postsCopy = shuffleArray(postsCopy).slice(0, AMOUNT_OF_RANDOM_POSTS);
        break;
      case 'discussed':
        postsCopy.sort((prev, next) => next.comments.length - prev.comments.length);
        break;
      default:
        break;
    }
    displayPosts(postsCopy);
  };

  const debouncedRenderPosts = debounce(renderFilteredPosts, RERENDER_DELAY);

  buttons.forEach((button) => {

    button.addEventListener('click', () => {
      const currentButton = document.querySelector('.img-filters__button--active');
      currentButton.classList.remove('img-filters__button--active');
      button.classList.add('img-filters__button--active');

      const filterType = button.id.split('filter-')[1];

      debouncedRenderPosts(filterType);
    });
  });
};
