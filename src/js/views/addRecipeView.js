import View from './View.js';

import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');  
  _btnClose = document.querySelector('.btn--close-modal');  

  constructor() {
      super();
      this._addHandlerShowWindow();  
      this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', () => this.toggleWindow()) 
  } 

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', () => this.toggleWindow());
    this._overlay.addEventListener('click', () => this.toggleWindow());
  }

  addHandlerUpload(handler) {
      this._parentElement.addEventListener('submit', e => {
          e.preventDefault();
          const dataArr = [...new FormData(this._parentElement)];
          const data = Object.fromEntries(dataArr)
          if (!data) return;
          
          handler(data)
      })
  }

  _generateMarkup() {
    
  } 
}

export default new AddRecipeView();
