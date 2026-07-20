const Note = require('../models/Notes.models');
const mongoose = require('mongoose');

module.exports = {
  createNote: (req, res) => {
    const { title, content, color } = req.body;
    const userId = req.user._id;

    const newNote = new Note({
      title,
      content,
      color: color || '#ffd54f',
      User: userId
    });

    newNote.save()
      .then(savedNote => {
        res.status(201).json(savedNote);
      })
      .catch(err => {
        console.error('Error saving note:', err.message);
        res.status(500).json({ error: 'Failed to save note', message: err.message });
      });
  },

  getAllNotes: (req, res) => {
    Note.find({ User: req.user._id })
      .then(allNotes => {
        if (allNotes.length === 0) {
          return res.status(200).json({ allNotes: [] });
        }
        res.status(200).json({ allNotes });
      })
      .catch(error => {
        console.error('Error fetching notes:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  },

  deleteNotes: (req, res) => {
    const noteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ msg: 'Invalid ObjectId format' });
    }

    Note.findById(noteId)
      .then(note => {
        if (!note) {
          return res.status(404).json({ msg: 'Note not found' });
        }
        if (note.User.toString() !== req.user._id.toString()) {
          return res.status(403).json({ msg: 'Not authorized to delete this note' });
        }
        return Note.findByIdAndDelete(noteId).then(deletedNote => {
          res.status(200).json({ msg: 'Note deleted successfully', deletedId: deletedNote._id });
        });
      })
      .catch(err => {
        console.error('Error deleting note:', err.message);
        res.status(500).json({ msg: 'Failed to delete note', error: err.message });
      });
  },

  updateNote: (req, res) => {
    const noteId = req.params.id;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ msg: 'Invalid ObjectId format' });
    }

    Note.findById(noteId)
      .then(note => {
        if (!note) {
          return res.status(404).json({ msg: 'Note not found' });
        }
        if (note.User.toString() !== req.user._id.toString()) {
          return res.status(403).json({ msg: 'Not authorized to update this note' });
        }
        return Note.findByIdAndUpdate(noteId, updatedData, { new: true }).then(updatedNote => {
          res.status(200).json({ msg: 'Note updated successfully', updatedNote });
        });
      })
      .catch(error => {
        console.error('Error updating note:', error.message);
        res.status(500).json({ error: 'Failed to update note', message: error.message });
      });
  }
};
