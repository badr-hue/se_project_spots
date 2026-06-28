import "./index.css";

import logo from "../images/logo.svg";
import avatarImg from "../images/avatar.jpg";
import editIcon from "../images/edit_icon.svg";
import plusIcon from "../images/plus_icon.svg";
import closeIcon from "../images/close_icon.svg";

import { enableValidation, resetValidation, disableButton } from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/buttonLoading.js";

const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error"
};

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const avatar = document.querySelector(".profile__avatar");

const editProfileBtn = document.querySelector(".profile__edit-btn");
const newPostBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-description-input");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");

const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancelBtn = deleteModal.querySelector(".modal__submit-btn_type_cancel");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "27f6796b-35b4-40da-86a2-2e8faab88a23",
    "Content-Type": "application/json",
  },
});

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(evt.target);
  }
}

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data && data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  cardLikeBtnEl.addEventListener("click", () => {
    const isLiked = cardLikeBtnEl.classList.contains("card__like-btn_active");
    api.likeStatus(data._id, isLiked)
      .then(() => {
        cardLikeBtnEl.classList.toggle("card__like-btn_active");
      })
      .catch(console.error);
  });

  cardDeleteBtnEl.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api.editUserInfo({
    name: editProfileNameInput.value,
    about: editProfileDescriptionInput.value
  })
  .then((updatedUserInfo) => {
    profileNameEl.textContent = updatedUserInfo.name;
    profileDescriptionEl.textContent = updatedUserInfo.about;
    closeModal(editProfileModal);
  })
    .catch((err) => {
    console.error(err);
  })
  .finally(() => setButtonText(submitBtn, false, "Save", "Saving..."));
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api.getNewCard({
    name: newPostCaptionInput.value,
    link: newPostImageInput.value
  })
  .then((cardData) => {
    const cardElement = getCardElement(cardData);
    cardsList.prepend(cardElement);
    closeModal(newPostModal);
    newPostForm.reset();
    disableButton(newPostSubmitBtn, config);
  })
  .catch((err) => {
    console.error(err);

  })
  .finally(() => setButtonText(submitBtn, false, "Save", "Saving..."));
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api.editAvatarInfo(avatarInput.value)
    .then((data) => {
      avatar.src = data.avatar;
      avatarForm.reset();
      disableButton(avatarSubmitBtn, config);
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error(err);
         })
    .finally(() => setButtonText(submitBtn, false, "Save", "Saving..."));
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api.deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
     .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
      });
}

function setLocalImages() {
  document.querySelector(".header__logo").src = logo;
  avatar.src = avatarImg;

  const editBtnImg = editProfileBtn.querySelector("img");
  if (editBtnImg) editBtnImg.src = editIcon;

  const addBtnImg = newPostBtn.querySelector("img");
  if (addBtnImg) addBtnImg.src = plusIcon;

  document.querySelectorAll(".modal__close-btn").forEach(icon => {
    icon.src = closeIcon;
  });
}

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, config);
  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  resetValidation(newPostForm, config);
  openModal(newPostModal);
});

avatarModalBtn.addEventListener("click", () => {
  resetValidation(avatarForm, config);
  openModal(avatarModal);
});

editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));
previewCloseBtn.addEventListener("click", () => closeModal(previewModal));
deleteCancelBtn.addEventListener("click", () => closeModal(deleteModal));

editProfileModal.addEventListener("click", handleOverlayClick);
newPostModal.addEventListener("click", handleOverlayClick);
avatarModal.addEventListener("click", handleOverlayClick);
previewModal.addEventListener("click", handleOverlayClick);
deleteModal.addEventListener("click", handleOverlayClick);

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

function init() {
  setLocalImages();

  api.getAppInfo()
    .then(([cards, userData]) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      avatar.src = userData.avatar;
      avatar.alt = `${userData.name}'s avatar`;

      cards.forEach((item) => {
        const cardElement = getCardElement(item);
        cardsList.append(cardElement);
      });
    })
    .catch(console.error);

  enableValidation(config);
}

init();