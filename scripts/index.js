const myLibrary = [
  new Book(
    'The Hobbit',
    'J.R.R. Tolkien',
    1937,
    'The Hobbit, or There and Back Again, is a children\'s fantasy novel by English author J. R. R. Tolkien.',
    'https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg'
  ),
  new Book(
    'Learning JavaScript Design Patterns',
    'Addy Osmani',
    2012,
    'With Learning JavaScript Design Patterns, you\’ll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language.',
    'https://images-na.ssl-images-amazon.com/images/I/51GUOKqJP3L._SX379_BO1,204,203,200_.jpg'
  ),
];

function Book(title, author, year, description, imgSource) {
  this.title = title;
  this.author = author;
  this.year = year;
  this.description = description;
  this.imgSource = imgSource;
}

function addBookToLibrary() {

}

function showAddBookModal() {
  let modalContainer = document.getElementById('modal-container');
  let modal = document.getElementById('modal');

  modalContainer.classList.remove('modal-hidden');
  setTimeout(function () {
    modal.classList.add('centered');
  }, 10);
}

function hideAddBookModal() {
  let modalContainer = document.getElementById('modal-container');
  let modal = document.getElementById('modal');

  modal.classList.remove('centered');
  setTimeout(function () {
    modalContainer.classList.add('modal-hidden');
  }, 300);
}

function createNewBookElement() {
  const bookTemplate = document.getElementById('book-template');
  const deepCopy = true;

  /** @type {Element} */
  const newBookElement = bookTemplate.cloneNode(deepCopy);
  newBookElement.removeAttribute('style');

  return newBookElement;
}

function render() {
  const bookList = document.getElementById('book-list');

  myLibrary.forEach(function (book) {
    let bookElement = createNewBookElement();
    bookElement.querySelector('img').setAttribute('src', book.imgSource);
    bookElement.querySelector('.book-title').textContent = book.title;
    bookElement.querySelector('.year').textContent = book.year;
    bookElement.querySelector('.book-author').textContent = book.author;
    bookElement.querySelector('.book-description').textContent = book.description;

    bookList.append(bookElement);
  });
}

render();
