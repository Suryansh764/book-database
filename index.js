const { initializeDatabase } = require("./db/db.connect");
const express = require ("express")
const app = express()
const Book = require("./models/book.models");
app.use(express.json())

initializeDatabase()
    .then(() => console.log("Connected to database"))
    .catch(err => {
        console.log("Database connection failed", err);
        process.exit(1);
    });

app.get("/", (req, res) => {
    res.send("Books API")
})

async function createBook(newBook){
    try{
        const book = new Book(newBook);
        const savedBook = await book.save();
        return savedBook;
    } catch (error){
        throw error;
    }
}


app.post("/books", async(req, res) => {
    try{
        const saveBook = await createBook(req.body)
        res.status(201).json({message: "Book added successfully.", book: saveBook})
    } catch (error) {
        res.status(500).json({error: "Failed to add book."})
    }

})



async function readAllBooks(){
    try{
        const allBooks = await Book.find()
        return allBooks
    } catch (error){
        throw error
    }
}

app.get("/books", async(req, res) => {
    try{
        const book = await readAllBooks()
        if(book.length != 0){
            res.json(book)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error){
        res.status(500).json({error: "Failed to fetch book details."})
    }
})

async function readBookByTitle(bookTitle){
    try{
        const bookByTitle = await Book.findOne({title: bookTitle})
        return bookByTitle
    } catch (error){
        throw error;
    }
}

app.get("/books/:bookTitle", async (req, res) => {
    try{
        const book = await readBookByTitle(req.params.bookTitle)
        if(book){
            res.json(book)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error){
        res.status(500).json({error: "Failed to fetch book details."})
    }
})

async function readBookByAuthor(bookAuthor){
    try{
        const bookByAuthor = await Book.find({author: bookAuthor})
        return bookByAuthor
    } catch (error){
        throw error;
    }
}

app.get("/books/author/:authorName", async(req, res) => {
    try{
        const book = await readBookByAuthor(req.params.authorName)
        if(book.length != 0){
            res.json(book)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error){
        res.status(500).json({error: "Failed to fetch book details."})
    }
})

async function readBookByGenre(bookGenre){
    try{
        const bookByGenre = await Book.find({genre: bookGenre})
        return bookByGenre
    } catch (error){
        throw error
    }
}

app.get("/books/genre/:bookGenre", async(req, res) => {
    try{
        const book = await readBookByGenre(req.params.bookGenre)
        if(book.length != 0){
            res.json(book)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error){
        res.status(500).json({error: "Failed to fetch book details."})
    }
})

async function readBookByReleaseYear(bookYear){
    try{
        const bookByYear = await Book.find({publishedYear: bookYear})
        return bookByYear
    } catch (error){
        throw error
    }
}

app.get("/books/publishedYear/:bookYear", async(req, res) => {
    try{
        const book = await readBookByReleaseYear(req.params.bookYear)
        if (book.length != 0){
            res.json(book)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error){
        res.status(500).json({error: "Failed to fetch book details."})
    }
})

async function updateBookRating(bookId, dataToUpdate){
    try{
        const updateBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
            new: true
        })
        return updateBook
    } catch {
        console.log("Error updating the book details.")
    }
}

app.post("/books/:bookId", async(req, res) => {
    try{
        const updatedBook = await updateBookRating(req.params.bookId, req.body)
        if(updatedBook){
            res.status(200).json({message: "Movie updated successfully.", updatedBook: updatedBook })
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error){
        res.status(500).json({error: "Failed to update the book details."})
    }
})

async function updateBookByTitle(bookTitle, dataToUpdate){
    try{
        const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {
            new: true
        })

        return updatedBook
    } catch (error){
        console.log("Error updating the book details.", error)
    }
}

app.post("/books/update/:bookTitle", async(req, res) => {
    try{
        const updateBook = await updateBookByTitle(req.params.bookTitle, req.body)

        if(updateBook){
            res.status(200).json({message: "Book updated successfully.", updateBook: updateBook})
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error){
        res.status(500).json({error: "Failed to update the book details."})
    }
})

async function deleteBookById(bookId){
    try{
        const deletedBook = await Book.findByIdAndDelete(bookId)
        return deletedBook
    } catch (error){
        console.log(error)
    }
}

app.delete("/books/:bookId", async(req, res) => {
    try{
        const deleteBook = await deleteBookById(req.params.bookId)
        if(deleteBook){
            res.status(200).json({message: "Book deleted successfully.", book: deleteBook})
        }
    } catch (error){
        res.status(500).json({error: "Failed to delete the book details."})
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`)
})
