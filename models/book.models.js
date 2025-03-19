const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
    genre: [
        {
            type: String,
            enum: [
                "Fiction",
                "Historical",
                "Romance",
                "Fantasy",
                "Mystery",
                "Thriller",
                "Non-fiction",
                "Non-Fiction",
                "Self-help",
                "Business",
                "Autobiography"
            ],
        },
    ],
    language: String,
    country: String,
    rating: Number,
    summary: String,
    coverImageUrl: String,
},
    {
        timestamps: true
    }
);

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;