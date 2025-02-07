import { ALLOWED_EXTENSIONS, AMOUNT_OF_COMMENTS_PER_LOAD, AVATAR_HEIGHT, AVATAR_WIDTH } from './settings.js';

export const initiateLightroom = (posts) => {
  const bigPictureElement = document.querySelector('.big-picture');
  const loadMoreCommentsButton = bigPictureElement.querySelector('.social__comments-loader');
  const imageElement = bigPictureElement.querySelector('.big-picture__img img');
  const commentsShownAmountElement = bigPictureElement.querySelector('.social__comment-shown-count');

  // ---
  // HELPERS
  // ---

  const createCommentTemplate = () => {
    const template = document.createElement('li');
    template.classList.add('social__comment');

    const image = document.createElement('img');
    image.classList.add('social__picture');
    image.width = AVATAR_WIDTH;
    image.height = AVATAR_HEIGHT;

    const text = document.createElement('p');
    text.classList.add('social__text');
    text.textContent = 'Ваш комментарий может быть первым!';

    template.append(image);
    template.append(text);

    return template;
  };

  const setBigPictureData = ({ url, likes, comments, description }) => {
    const likesElement = bigPictureElement.querySelector('.likes-count');
    const commentsTotalAmountElement = bigPictureElement.querySelector('.social__comment-total-count');
    const descriptionElement = bigPictureElement.querySelector('.social__caption');

    descriptionElement.textContent = description;
    imageElement.src = url;
    likesElement.textContent = likes;
    commentsTotalAmountElement.textContent = comments.length;
    commentsShownAmountElement.textContent = 0;
  };

  const renderComments = (comments) => {
    const commentsListElement = bigPictureElement.querySelector('.social__comments');

    commentsListElement.innerHTML = '';
    const commentsListFragment = document.createDocumentFragment();
    const commentTemplate = createCommentTemplate();


    comments.forEach(({ avatar, message, name }) => {
      const commentFragment = commentTemplate.cloneNode(true);

      const commentImageElement = commentFragment.querySelector('.social__picture');
      commentImageElement.src = avatar;
      commentImageElement.alt = name;

      const commentTextElement = commentFragment.querySelector('.social__text');
      commentTextElement.textContent = message;

      commentsListFragment.append(commentFragment);


      commentsShownAmountElement.textContent = comments.length;
    });

    commentsListElement.append(commentsListFragment);
  };

  const getPostIdByImageSource = (src) => {
    const regExpId = new RegExp(`/[0-9a-zA-Z]+.(${ALLOWED_EXTENSIONS.join('|')})$`, 'g');

    const imageUrl = src.match(regExpId)[0];
    const foundPosts = posts.filter((post) => post.url.match(regExpId)[0] === imageUrl);

    if (!foundPosts) {
      throw new Error('No posts found for this image!');
    }

    if (foundPosts.length > 1) {
      throw new Error('Found several posts with the same image!');
    }
    const postId = foundPosts[0].id;

    return postId;
  };

  const getPostByImageSource = (src) => {
    const postId = getPostIdByImageSource(src);
    const postData = posts.find((post) => post.id === postId);

    return postData;
  };

  const loadMoreComments = () => {
    const comments = getPostByImageSource(imageElement.src).comments;
    const oldAmount = parseInt(commentsShownAmountElement.textContent, 10);

    let newAmount = comments.length;
    if ((oldAmount + AMOUNT_OF_COMMENTS_PER_LOAD) < comments.length) {
      newAmount = oldAmount + AMOUNT_OF_COMMENTS_PER_LOAD;
    }

    if (newAmount === comments.length) {
      loadMoreCommentsButton.classList.add('hidden');
    } else {
      loadMoreCommentsButton.classList.remove('hidden');
    }

    const commentsListToShow = comments.slice(0, newAmount);
    renderComments(commentsListToShow);
  };

  const closeModal = () => {
    bigPictureElement.classList.add('hidden');
    document.body.classList.remove('modal-open');
  };

  const onLoadMoreCommentsClick = () => {
    loadMoreComments();
  };

  const onModalCloseButtonClick = () => {
    closeModal();
    removeModalListeners();
  };

  const onEscapePress = (evt) => {
    if (evt.key === 'Escape') {
      closeModal();
      removeModalListeners();
    }
  };

  function removeModalListeners() {
    document.removeEventListener('keydown', onEscapePress);
    bigPictureElement.removeEventListener('click', onModalCloseButtonClick);

    loadMoreCommentsButton.removeEventListener('click', onLoadMoreCommentsClick);
  }

  // ---
  // LISTEN TO CLICKS AND OPEN MODAL
  // ---

  const imagesContainer = document.querySelector('.pictures');

  imagesContainer.addEventListener('click', (evt) => {
    const thumbnailElement = evt.target.closest('.picture');

    if (thumbnailElement) {
      evt.preventDefault();
      bigPictureElement.classList.remove('hidden');
      document.body.classList.add('modal-open');

      const pictureElement = thumbnailElement.querySelector('.picture__img');
      const postData = getPostByImageSource(pictureElement.src);

      setBigPictureData(postData);
      loadMoreComments();

      const closeButton = bigPictureElement.querySelector('.big-picture__cancel');
      closeButton.addEventListener('click', onModalCloseButtonClick);
      document.addEventListener('keydown', onEscapePress);

      loadMoreCommentsButton.addEventListener('click', onLoadMoreCommentsClick);
    }
  });
};
