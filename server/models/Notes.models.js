const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  color: { type: String, default: '#ffd54f' },
  pinned: { type: Boolean, default: false },
  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
