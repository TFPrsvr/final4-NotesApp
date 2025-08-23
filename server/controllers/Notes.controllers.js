const Note = require('../models/Notes.models')
// const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

module.exports = {

    testRoute: (req, res) => {
        console.log('test route hit!!', req.body)
        res.json({ msg: 'Hello WOrld!' })
    },
    


    getTest: (req, res) => {
      console.log('get test hit', req.body)
      res.json({msg: 'get test worked'})
    },
    
    
    

    
    createNote: (req, res) => {
      const {title, content} = req.body
      const userId = req.user._id

      const token = jwt_token(userId) 
      console.log('token:', token)
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('Token verifcation failed:', err.message)
          return res.status(401).json({msg: 'Invalid token'})
        }
      })
       const NewNote = new Note({
        // id: uuidv4(),
        
        title: req.body.title,
        content: req.body.content,
        User: userId
      });
      console.log('createNote hit!B', req.body)
      console.log('createNote hit', req.body, req.params.id)

      NewNote.save()
      .then(savedNote => {
        console.log('saved note:', savedNote.length)
        res.status(201).json(savedNote)
      })
      .catch(err => {
        console.error('Error saving note', err)
        res.status(500).json({error: 'Faled to save note', error: err.message})
      }) 

      console.log('userToken:', req.user)
      console.log('user:', req.body, req.params.userId)
    },
    
    
    
    
    
    
    getAllNotes: async (req, res) => {

      try {
        console.log('getAllNotes hit!!', req.body); 
            const allNotes = await Note.find(); 
        console.log('Fetched notes:', allNotes); 
    
        if (allNotes.length === 0) {
          return res.status(404).json({ message: 'No notes found' });
        }
    
        res.status(200).json({ allNotes });
      } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },




    deleteNotes: (req, res ) => {
      const noteId = req.params.id;  
      console.log('delNotes w/ id hit!!', noteId);
    
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({msg: 'Invalid ObjectId format'})
      }
      Note.findByIdAndDelete(noteId)
        .then(deletedNote => {
          if (deletedNote) {
            console.log("delNotes successful", deletedNote);
            res.status(200).json({ msg: 'Note deleted successfully', deletedId: deletedNote._id });
          } else {
            console.log('No note found with that ID');
            res.status(404).json({ msg: 'Note not found' });
          }
        })
        .catch(err => {
          console.log('delNotes error', err);
          res.status(500).json({ msg: 'Failed to delete note', error: err.response || err.message});
        })
      },
      



      updateNote: (req, res) => {
        const noteId = req.params.id
        const updatedData = req.body
        // const {title, content} = updatedData
        const {title, content, userId} = updatedData

        if(!mongoose.Types.ObjectId.isValid(noteId)) {
          return res.status(400).json({msg: 'Invalid ObjectId format'})
        }
       
        Note.findByIdAndUpdate(
          noteId, 
          updatedData, 
          {new: true})
        .then(updatedNote => {
          if(updatedNote) {
            res.status(200).json({msg: 'Note updated successfully', updatedNote})
        // return res.status(404).json({msg: 'note not found'})
          }  else {
          res.status(404).json({msg: 'Note note found'})
          // res.json({msg: 'fetched updated notes successfully', updatedData})
        } 
      }) .catch(error => {
          console.error('error updating note'. err)
            res.status(500).json({error: 'failted to update note', error: err.response || err.message})
        })
      },


      
    }
    