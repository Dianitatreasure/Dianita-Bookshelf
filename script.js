let books = [];
let editingBookId = null;

// Memuat buku dari localStorage
function loadBooks() {
    const savedBooks = localStorage.getItem("books");
    if (savedBooks) {
        books = JSON.parse(savedBooks);
        renderBooks();
    }
}

// Menyimpan buku ke localStorage
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// Menambahkan atau mengedit buku
function addOrEditBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = Number(document.getElementById("year").value);
    const isComplete = document.getElementById("isComplete").checked;

    if (editingBookId) {
        // Edit buku
        const book = books.find(b => b.id === editingBookId);
        if (book) {
            book.title = title;
            book.author = author;
            book.year = year;
            book.isComplete = isComplete;
            editingBookId = null; // Reset ID editing
        }
    } else {
        // Tambah buku baru
        const newBook = {
            id: new Date().getTime(),
            title,
            author,
            year,
            isComplete,
        };
        books.push(newBook);
    }

    saveBooks();
    renderBooks();
    clearForm();
}

// Mengosongkan form
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("year").value = "";
    document.getElementById("isComplete").checked = false;
    editingBookId = null; // Reset mode edit
}

// Merender buku ke DOM
function renderBooks(filteredBooks = books) {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of filteredBooks) {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Year: ${book.year}</p>
        `;

        const toggleButton = document.createElement("button");
        toggleButton.textContent = book.isComplete ? "Mark as Unfinished" : "Mark as Finished";
        toggleButton.onclick = () => toggleBookStatus(book.id);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editBook(book.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteBook(book.id);

        bookElement.appendChild(toggleButton);
        bookElement.appendChild(editButton);
        bookElement.appendChild(deleteButton);

        if (book.isComplete) {
            completeBookshelfList.appendChild(bookElement);
        } else {
            incompleteBookshelfList.appendChild(bookElement);
        }
    }
}

// Memulai mode edit untuk buku
function editBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("year").value = book.year;
        document.getElementById("isComplete").checked = book.isComplete;
        editingBookId = bookId;  // Set ID buku yang sedang diedit
    }
}

// Mencari buku berdasarkan judul
function searchBooks() {
    const searchTitle = document.getElementById("searchTitle").value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTitle)
    );
    renderBooks(filteredBooks);
}

// Toggle status buku
function toggleBookStatus(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
    }
}

// Menghapus buku
function deleteBook(bookId) {
    books = books.filter(b => b.id !== bookId);
    saveBooks();
    renderBooks();
}

// Inisialisasi
window.onload = () => {
    loadBooks();
};
