const NotesController = require('../controllers/Notes.controllers');
const UserController = require('../controllers/User.controller')
const Note = require('../models/Notes.models')
const User = require('../models/User.models')
const Auth = require('../middleware/auth')

module.exports = (app) => {

app.get('/api/testRoute', NotesController.testRoute)
app.get('/api/get/test', NotesController.getTest)

app.post('/api/createNote', Auth, NotesController.createNote)
app.put('/api/update/note/:id', Auth, NotesController.updateNote)
app.delete(`/api/delete/note/:id`, Auth, NotesController.deleteNotes)
app.get('/api/note/get', NotesController.getAllNotes)


app.get('/api/user/testRoute', (req, res) => {
    console.log('testRoute hit!!')
    res.json({msg: 'hello world!!'})
})


//Register & Login routes for User
app.get('/api/testReg', UserController.testReg)
app.post('/api/users/register', UserController.registerUser)
app.post('/api/users/loginUser', Auth, UserController.loginUser)
app.get('/api/users/logout', UserController.logoutUser)
app.get('/api/getUser', Auth, UserController.getUser)



}