const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/commentsdb';
mongoose.connect(mongoURI, { 
    useNewUrlParser: true, // Deprecated; you can remove this
    useUnifiedTopology: true // Keep this for now
})
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set Mongoose strictQuery option to false (or true based on your needs)
mongoose.set('strictQuery', false); // or true to suppress the warning

// Define a comment schema and model
const commentSchema = new mongoose.Schema({
    text: String,
});
const Comment = mongoose.model('Comment', commentSchema);

// GET all comments
app.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new comment
app.post('/comments', async (req, res) => {
    const comment = new Comment({
        text: req.body.text,
    });
    try {
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});