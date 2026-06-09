// utils/Api.js

export default class Api {
  constructor({ _baseUrl, _headers }) {
    this._baseUrl = _baseUrl;
    this._headers = _headers;
  }

  getAppInfo() {
    return Promise.all([
      this.getUserInfo(),
       this.getInitialCards()]);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/v1/cards`, {
  headers: {
    authorization: this._headers.authorization,
    "Content-Type": this._headers["Content-Type"]
  }
})
  .then((res) => {
    if(res.ok) {
      return res.json();
    }
    return Promise.reject(new Error(`Error: ${res.status}`));
  });
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,

      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
    if(res.ok) {
      return res.json();
    }
    return Promise.reject(new Error(`Error: ${res.status}`));
  });
  }

  // other methods for working with the API
}

// export the class