import express from 'express';
import cloudinary from "../lib/cloudinary.js";
import protectRoute from '../middleware/auth.middleware.js';
import Book from "../models/Book.js";

const router = express.Router();

// create a book 
router.post("/", protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;

        if (!title || !caption || !rating || !image) return res.status(400).json({ message: "All fields are required" });

        // upload the image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        // save to the database

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            // user:req.user_id,
        })

        await newBook.save();

        res.status(201).json(newBook);

    } catch (error) {
        console.log("Error creating a book", error);
        res.status(500).json({ message: error.message })
    }

});

router.get("/", protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ created: -1 }) // desc
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        const total = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            toatlPages: Math.ceil(totalBooks / limit),
        });

    } catch (error) {
        console.log("Error in get all books route", error);
        res.status(500).json({ message: "Internal server error" })
    }
});

// get recommeded books by the logged in user
router.get("/user", protectRoute, async (req, res) => {
    try {
        const books = (await Book.find({ user: req.user._id })).toSorted({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        console.error("Get user books error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        //check if the user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this book" });
        }
        //delet the image from cloudinary as well
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.log("Error deleting image from cloudinary", error);
            }
        }

        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log("Error deleting book", error);
        res.status(500).json({ message: "Internal server error" });
    }
})



export default router;