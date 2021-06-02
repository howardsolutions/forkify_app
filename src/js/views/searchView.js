class SearchView {
    #parentElement = document.querySelector('.search');

    getTerm() {
        const term =  this.#parentElement.querySelector('.search__field').value;
        this.#clearInput();
        return term
    }

    #clearInput() {
        this.#parentElement.querySelector('.search__field').value = '';
    }

    // publisher - subscriber pattern in MVC.
    addHandlerRender(handler) {
       this.#parentElement.addEventListener('submit', e => {
           e.preventDefault();
           handler();
       })        
    }
 }

export default new SearchView();