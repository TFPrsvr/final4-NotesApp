const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const NoteSchema = new Schema ({

    // id: {type: String, required: true, unique: true},

    title: {type: String, required: true},

    content: {type: String, required: true},

    User: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
})

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;