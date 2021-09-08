import galleryItems from '../app.js';

const galleryListEl = document.querySelector('.js-gallery');
const lightboxEl = document.querySelector('.js-lightbox');
const lightboxImageEl = document.querySelector('.lightbox__image');
const btnCloseLightbox = document.querySelector('.lightbox__button');
const lightboxOverlay = lightboxEl.querySelector('.lightbox__overlay');

//Создание и рендер разметки по массиву данных galleryItems из app.js и предоставленному шаблону.
const createGalleryListMarkup = (itemsArr) => {
    return itemsArr.map(({ preview, original, description }) => {
        return `
        <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>
        `
    }).join('');
};
 
const galleryListMarkup = createGalleryListMarkup(galleryItems);
galleryListEl.insertAdjacentHTML('beforeend', galleryListMarkup);

//масив всех img
const imgArrey = galleryListEl.querySelectorAll('.gallery__image');
let counter = {
  value: 0,
  min: 0,
  max: 8,
  increment() {
    if (this.value < this.max) {
      this.value += 1;
    }
   },
  decrement() {
    if (this.value > this.min) {
      this.value -= 1;
     }
   },
}
//Реализация делегирования на галерее ul.js - gallery и получение url большого изображения.
galleryListEl.addEventListener('click', onGalleryListClick);


function onGalleryListClick(event) {
    event.preventDefault();
    const isImgEl = event.target;
    
    if (isImgEl.nodeName !== 'IMG') { return };

    //получение url большого изображения.
    const originalImgUrl = getOriginalImgUrl(isImgEl);

    
  //Открытие модального окна по клику на элементе галереи.
  openLightbox(lightboxEl);

  //Очистка значения атрибута src элемента img.lightbox__image.Это необходимо для того,чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.
  removeLightboxImageAttributes();
  //Подмена значения атрибута src элемента img.lightbox__image.
  setLightboxImageAttributes(originalImgUrl, isImgEl.alt);
  
  const currentImgIndex = imgArrey.forEach((currentValue, index, arrey) => {
    if (isImgEl.alt === currentValue.alt) {
      counter.value = index;
    }
  });
};

  //получение url большого изображения.
function getOriginalImgUrl(image) {
    return image.dataset.source;
};

  //Открытие модального окна по клику на элементе галереи.
function openLightbox(lightbox) {
  window.addEventListener('keydown', onEscKeyPress);
  lightboxOverlay.addEventListener('click', onBackdropClick);
  window.addEventListener('keydown', onArrowRightPress);
  window.addEventListener('keydown', onArrowLeftPress);
return lightbox.classList.add('is-open');
};

//Подмена значения атрибута src элемента img.lightbox__image.
function setLightboxImageAttributes(imgUrl, imgAlt) {
  lightboxImageEl.src = imgUrl;
  lightboxImageEl.alt = imgAlt;
};

  //Очистка значения атрибута src элемента img.lightbox__image.Это необходимо для того,чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.
function removeLightboxImageAttributes() {
  const currentActiveImage = lightboxImageEl.closest('.js-lightbox.is-open');
  if (currentActiveImage) {
    lightboxImageEl.src = '';
    lightboxImageEl.alt = '';
  };
};


//Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".
function onArrowRightPress(event) {
  const isArrowRight = event.code === 'ArrowRight';
  if (isArrowRight) {
    counter.increment();
    renderImageOnArrowKeypress(imgArrey[counter.value]);
  }
};

function onArrowLeftPress(event) {
  const isArrowLeft = event.code === 'ArrowLeft';
  if (isArrowLeft) {
    counter.decrement();
    renderImageOnArrowKeypress(imgArrey[counter.value]);
  }
};
 
function renderImageOnArrowKeypress(element) {
 lightboxImageEl.src = element.dataset.source;
  lightboxImageEl.alt = element.alt;
 }
//Закрытие модального окна 
//по клику на кнопку button[data - action= "close-lightbox"].
btnCloseLightbox.addEventListener('click', onCloseLightbox);

function onCloseLightbox(event) {
  window.removeEventListener('keydown', onEscKeyPress);
  lightboxEl.removeEventListener('click', onBackdropClick);
  window.removeEventListener('keydown', onArrowRightPress);
  window.removeEventListener('keydown', onArrowLeftPress);
  return lightboxEl.classList.remove('is-open');
};

//Закрытие модального окна по нажатию клавиши ESC.
function onEscKeyPress(event) {
  const isEscKey = event.code === 'Escape';
  if (isEscKey) {
    onCloseLightbox();
  }
}

//Закрытие модального окна по клику на div.lightbox__overlay.
function onBackdropClick(event) {
  if (event.currentTarget === event.target) {
    onCloseLightbox();
  } 
}









