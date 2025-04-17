const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
  tags: [String],
  comments: [CommentSchema] // ✅ Embedded comments
});

module.exports = mongoose.model('Post', PostSchema);
