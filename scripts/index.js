const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
  }
];

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");


const config = {
  formSelector: '.modal__form',
  inputSelector: '.modal__input',
  submitButtonSelector: '.modal__submit-btn',
  inactiveButtonClass: 'modal__submit-btn_disabled',
  inputErrorClass: 'modal__input_type_error',
  errorClass: 'modal__error'
};

const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostForm = newPostModal.querySelector(".modal__form");

const newPostCardImageLink = newPostModal.querySelector("#card-image-input");
const newPostCardCaption = newPostModal.querySelector("#card-description-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {

  modal.classList.remove("modal_is-opened");

 }

editProfileBtn.addEventListener("click", function() {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, config);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function(evt) {
  closeModal(editProfileModal);
 if (evt.target === editProfileModal)
      closeModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("keydown", function(evt) {

 if (evt.key === "Escape" ){
      closeModal(editProfileModal);
}
});

newPostBtn.addEventListener("click", function() {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function() {
  closeModal(newPostModal);
  if (evt.target === newPostModal)
      closeModal(newPostModal);
});

newPostCloseBtn.addEventListener("keydown", function(evt) {
  if (evt.key === "Escape") {
    closeModal(newPostModal);
  }
});


function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

function handleAddCardSubmit(evt) {

  evt.preventDefault();

  const inputValues = getCardElement({
    name: newPostCardCaption.value,
    link: newPostCardImageLink.value
  });
  cardsList.prepend(inputValues);
  evt.target.reset();
  disableButton(newPostSubmitBtn, config);
  closeModal(newPostModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.closest(".card").remove();
  });

  cardImageEl.addEventListener("click", () => {
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });



  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  return cardElement;
}

initialCards.forEach(function(item) {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
  });


editProfileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleAddCardSubmit);
previewModalCloseBtn.addEventListener("click", () => {
    closeModal(previewModal);
    if (evt.target === previewModal)      closeModal(previewModal);
});

previewModalCloseBtn.addEventListener("keydown", function(evt) {
  if (evt.key === "Escape") {
    closeModal(previewModal);
  }
});