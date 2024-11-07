/** @format */

const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKS_APPS";

document.addEventListener("DOMContentLoaded", () => {
	const submitForm = document.getElementById("form");
	submitForm.addEventListener("submit", (event) => {
		event.preventDefault();
		addBook();
	});

	if (isStorageExist()) {
		loadDataFromStorage();
	}
});

function addBook() {
	const textBook = document.getElementById("judul").value;
	const penulis = document.getElementById("penulis").value;
	const timestamp = document.getElementById("date").value;
	const halaman = document.getElementById("halaman").value;

	const generatedID = generateId();
	const bookObject = generatebookObject(
		generatedID,
		textBook,
		penulis,
		timestamp,
		halaman,
		false
	);
	books.push(bookObject);

	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}
function generateId() {
	return +new Date();
}

function generatebookObject(
	id,
	task,
	penulis,
	timestamp,
	halaman,
	isCompleted
) {
	return {
		id,
		task,
		penulis,
		timestamp,
		halaman,
		isCompleted,
	};
}

document.addEventListener(RENDER_EVENT, () => {
	console.log(books);
	const uncompletedBookList = document.getElementById("books");
	uncompletedBookList.innerHTML = "";

	const completedBookList = document.getElementById("complited-books");
	completedBookList.innerHTML = "";

	for (const bookItem of books) {
		const bookElemen = makeBook(bookItem);
		if (!bookItem.isCompleted) {
			uncompletedBookList.append(bookElemen);
		} else {
			completedBookList.append(bookElemen);
		}
	}
});

function makeBook(bookObject) {
	const textTitle = document.createElement("h2");
	textTitle.innerText = bookObject.task;

	const penulis = document.createElement("p");
	penulis.innerText = `penulis : ${bookObject.penulis}`;

	const textTimestamp = document.createElement("p");
	textTimestamp.innerText = `tanggal ditambahkan : ${bookObject.timestamp}`;

	const textHalaman = document.createElement("p");
	textHalaman.innerText = `jumlah halaman: ${bookObject.halaman}`;

	const textContainer = document.createElement("div");
	textContainer.classList.add("inner");
	textContainer.append(textTitle, penulis, textTimestamp, textHalaman);

	const container = document.createElement("div");
	container.classList.add("item", "shadow");
	container.append(textContainer);
	container.setAttribute("id", `book-${bookObject.id}`);

	if (bookObject.isCompleted) {
		const undoBtn = document.createElement("button");
		undoBtn.classList.add("undo-btn");

		undoBtn.addEventListener("click", () => {
			undoTaskFromCompleted(bookObject.id);
		});

		const cancelBtn = document.createElement("button");
		cancelBtn.classList.add("cancel-btn");

		cancelBtn.addEventListener("click", () => {
			removeTaskFromCompleted(bookObject.id);
		});

		container.append(undoBtn, cancelBtn);
	} else {
		const checkBtn = document.createElement("button");
		checkBtn.classList.add("check-btn");

		checkBtn.addEventListener("click", () => {
			addTaskToComplited(bookObject.id);
		});

		const cancelBtn = document.createElement("button");
		cancelBtn.classList.add("cancel-btn");

		cancelBtn.addEventListener("click", () => {
			removeTaskFromCompleted(bookObject.id);
		});

		container.append(checkBtn, cancelBtn);
	}

	return container;
}

function addTaskToComplited(bookId) {
	const bookTarget = findbook(bookId);

	if (bookTarget == null) return;

	bookTarget.isCompleted = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function findbook(bookId) {
	for (const bookItem of books) {
		if (bookItem.id === bookId) {
			return bookItem;
		}
	}
	return null;
}

function removeTaskFromCompleted(bookId) {
	const bookTarget = findbookIndex(bookId);

	if (bookTarget == -1) return;

	books.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function undoTaskFromCompleted(bookId) {
	const bookTarget = findbook(bookId);

	if (bookTarget == null) return;

	bookTarget.isCompleted = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function findbookIndex(bookId) {
	for (const index in books) {
		if (books[index].id === bookId) {
			return index;
		}
	}

	return -1;
}

function saveData() {
	if (isStorageExist()) {
		const parsed = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT));
	}
}

function isStorageExist() {
	if (typeof storage === undefined) {
		alert("browser anda tidak mendukung local storage");
		return false;
	}
	return true;
}

document.addEventListener(SAVED_EVENT, () => {
	console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const book of data) {
			books.push(book);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}
