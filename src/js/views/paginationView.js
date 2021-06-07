import View from './View.js';

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    // event delegation
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      // receive data from DOM
      const gotoPage = +btn.dataset.goto;

      //  pass page number DATA back to controller
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const { results, resultsPerPage, page } = this._data;

    const numsPage = Math.ceil(results.length / resultsPerPage);

    // Page 1 and Other pages
    if (page === 1 && numsPage > 1) {
      return `
            <button data-goto="${
              page + 1
            }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
          `;
    }

    // Last Page
    if (page === numsPage && numsPage > 1) {
      return ` <button data-goto="${
        page - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>`;
    }

    // other page
    if (page < numsPage) {
      return ` 
            <button data-goto="${
              page - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${page - 1}</span>
            </button>
            
            <button data-goto="${
              page + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${page + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
          `;
    }

    // ONLY have page 1
    if (page === 1 && numsPage === 1) {
      return '';
    }
  }
}

export default new PaginationView();
