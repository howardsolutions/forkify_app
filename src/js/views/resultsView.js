import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found! Please try again';
  _message = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return this._data.map(result => {
        return `
        <li class="preview">
        <a class="preview__link ${result.id === id ? 'preview__link--active' : ''}" 
        href="#${result.id}"
        >
          <figure class="preview__fig">
            <img src="${result.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            <div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
    }).join('')
  }
}

export default new ResultsView();
