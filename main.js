class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class Ui {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${book.isbn}</td><td><a href="#" class="delete">X</a></td>`;
        list.appendChild(row);
    }

    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        const filteredBooks = books.filter(book => book.isbn !== isbn);
        localStorage.setItem('books', JSON.stringify(filteredBooks));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', () => {
    const books = Store.getBooks();
    const ui = new Ui();
    books.forEach(book => ui.addBookToList(book));
});

// Event: Add a Book
document.getElementById('book-form').addEventListener('submit', (e) => {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);
    const ui = new Ui();

    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        ui.addBookToList(book);
        Store.addBook(book);
        ui.showAlert('Book added successfully', 'success');
        ui.clearFields();
    }

    e.preventDefault();
});

// Event: Remove a Book
document.getElementById('book-list').addEventListener('click', (e) => {
    const ui = new Ui();
    ui.deleteBook(e.target);

    // Remove book from local storage
    const isbn = e.target.parentElement.previousElementSibling.textContent;
    Store.removeBook(isbn);

    ui.showAlert('Book removed successfully', 'success');
    e.preventDefault();
});
