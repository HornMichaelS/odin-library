/**
 * UTILIIES
 */

 /**
  * @template T
  * @param {[T]} array
  * @param {(element: T) => boolean} predicate
  * 
  * @returns {number}
  */
 function arrayFirstIndexWhere(array, predicate) {
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i])) {
        return i;
      }
    }

    return -1;
 }

/**
 * MODEL
 */

const PersistedBookFactory = (function () {
  let id = 0;

  return {
    createBook: ({title, author, year, description, imgSource}) => ({
      id: id++,
      title,
      author,
      year,
      description,
      imgSource,
      isRead: false
    }),
  }
})();

const myLibrary = [];

/**
 * VIEW
 */

const controllerModule = (function (libraryModel) {
  let delegateView = null;
  let model = libraryModel;

  function init() {
    model.push(PersistedBookFactory.createBook({
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      year: 1937,
      description: 'The Hobbit, or There and Back Again, is a children\'s fantasy novel by English author J. R. R. Tolkien.',
      imgSource: 'https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg',
    }));

    model.push(PersistedBookFactory.createBook({
      title: 'Learning JavaScript Design Patterns',
      author: 'Addy Osmani',
      year: 2012,
      description: 'With Learning JavaScript Design Patterns, you\’ll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language.',
      imgSource: 'https://images-na.ssl-images-amazon.com/images/I/51GUOKqJP3L._SX379_BO1,204,203,200_.jpg',
    }));

    if (delegateView) {
      delegateView.modelDidUpdate(model);
    }
  }

  function setDelegateView(newDelegate) {
    delegateView = newDelegate;
  }

  function handleShowFormButtonClick() {
    if (delegateView) {
      delegateView.shouldRenderAddBookView();
    }
  }

  function handleSubmitButtonClick(bookProperties) {
    model = [...model, PersistedBookFactory.createBook(bookProperties)];
    if (delegateView) {
      delegateView.shouldDismissAddBookView();
      delegateView.modelDidUpdate(model);
    }
  }

  function handleCancelButtonClick() {
    if (delegateView) {
      delegateView.shouldDismissAddBookView();
    }
  }

  function handleHaveReadButtonClick(bookID) {
    model = model.map((book) => {
      let { isRead, id } = book;

      if (bookID === id) {
        let newIsRead = !isRead;
        let newBook = { ...book, isRead: newIsRead };
        return newBook;
      }

      return { ...book };
    });

    if (delegateView) {
      delegateView.modelDidUpdate(model);
    }
  }

  function handleDeleteButtonClick(bookID) {
    model = model.filter((book) => book.id !== bookID);
    if (delegateView) {
      delegateView.modelDidUpdate(model);
    }
  }

  return {
    init, 
    setDelegateView, 
    handleShowFormButtonClick,
    handleSubmitButtonClick,
    handleCancelButtonClick,
    handleHaveReadButtonClick,
    handleDeleteButtonClick,
  };
})(myLibrary);


/**********
 *  VIEW  *
 **********/
const viewModule = (function (controller) {
  let libraryDOMNode;
  let modalContainerDOMNode;
  let modalDOMNode;
  let formDOMNode;

  (function init() {
    libraryDOMNode = document.getElementById('book-list');
    modalContainerDOMNode = document.getElementById('modal-container');
    modalDOMNode = document.getElementById('modal');
    formDOMNode = document.querySelector('form');

    controller.setDelegateView({
      modelDidUpdate: function (libraryModel) {
        renderLibrary(libraryModel);
      },
      shouldRenderAddBookView: showAddBookModal,
      shouldDismissAddBookView: hideAddBookModal,
    });
  })();

  function renderLibrary(library) {
    addEventHandlerForShowFormButton();
    addEventHandlersForFormButtons();

    clearLibraryDOMNode();

    library.forEach(function (book) {
      let bookNode = createNodeForBook(book);
      addButtonHandlersToBookNode(bookNode, book.id);
      appendBookNodeToLibraryNode(bookNode);
    });
  }

  function addEventHandlerForShowFormButton() {
    const showFormButton = document.getElementById('show-form-button');

    showFormButton.addEventListener('click', function () {
      controller.handleShowFormButtonClick();
    });
  }

  function addEventHandlersForFormButtons() {
    const submitButton = document.getElementById('submit-button');
    const cancelButton = document.getElementById('cancel-button');

    submitButton.onclick = function (e) {
      e.preventDefault();
      const bookProperties = getNewBookPropertiesFromForm();
      controller.handleSubmitButtonClick(bookProperties);
    };

    cancelButton.onclick = controller.handleCancelButtonClick;
  }

  function getNewBookPropertiesFromForm() {
    /** @type {HTMLFormControlsCollection} */
    const controls = formDOMNode.elements;
    const bookProperties = {};

    for (let i = 0; i < controls.length; i++) {
      /** @type {HTMLInputElement} */
      const control = controls[i];
      bookProperties[control.name] = control.value;
    }

    return bookProperties;
  }

  function clearLibraryDOMNode() {
    while (libraryDOMNode.lastChild) {
      libraryDOMNode.removeChild(libraryDOMNode.lastChild);
    }
  }

  function createNodeForBook(book) {
    const bookNode = getNewBookNodeFromTemplate();
    populateBookNodeFromBook({ bookNode, book });
    return bookNode;
  }

  function addButtonHandlersToBookNode(bookNode, bookID) {
    let deleteButton = bookNode.querySelector('.delete-button');
    let haveReadButton = bookNode.querySelector('.have-read-button');

    deleteButton.addEventListener('click', function () {
      controller.handleDeleteButtonClick(bookID);
    });

    haveReadButton.addEventListener('click', function () {
      controller.handleHaveReadButtonClick(bookID);
    })
  }

  function appendBookNodeToLibraryNode(bookNode) {
    libraryDOMNode.append(bookNode);
  }

  function populateBookNodeFromBook({ bookNode, book }) {
    bookNode.setAttribute('data-bookID', book.id);

    if (book.imgSource) {
      let coverImageNode = bookNode.querySelector('img');
      coverImageNode.setAttribute('src', book.imgSource);
      coverImageNode.classList.remove('no-cover');
    }

    if (book.isRead) {
      let haveReadButton = bookNode.querySelector('.have-read-button');
      haveReadButton.classList.add('green-button');
    }
    
    bookNode.querySelector('.book-title').textContent = book.title;
    bookNode.querySelector('.year').textContent = book.year;
    bookNode.querySelector('.book-author').textContent = book.author;
    bookNode.querySelector('.book-description').textContent = book.description;
  }

  function getNewBookNodeFromTemplate() {
    const bookTemplate = document.getElementById('book-template');

    const deepCopy = true;
    const newBookNode = bookTemplate.cloneNode(deepCopy);
    
    newBookNode.removeAttribute('style');
    newBookNode.removeAttribute('id');
  
    return newBookNode;
  }

  function showAddBookModal() {
    modalContainerDOMNode.classList.remove('modal-hidden');

    setTimeout(function () {
      modal.classList.add('centered');
    }, 10);
  }
  
  function hideAddBookModal() {
    formDOMNode.reset();
  
    modal.classList.remove('centered');
    setTimeout(function () {
      modalContainerDOMNode.classList.add('modal-hidden');
    }, 300);
  }
})(controllerModule);

controllerModule.init();
