const NotesController = require('../controllers/Notes.controllers');
const UserController = require('../controllers/User.controller');
const Auth = require('../middleware/auth');

module.exports = (app) => {
  // Notes (all protected)
  app.post('/api/createNote', Auth, NotesController.createNote);
  app.get('/api/note/get', Auth, NotesController.getAllNotes);
  app.put('/api/update/note/:id', Auth, NotesController.updateNote);
  app.delete('/api/delete/note/:id', Auth, NotesController.deleteNotes);

  // Users
  app.post('/api/users/register', UserController.registerUser);
  app.post('/api/users/loginUser', UserController.loginUser);
  app.get('/api/users/logout', UserController.logoutUser);
  app.get('/api/getUser', Auth, UserController.getUser);
  app.put('/api/users/preferences', Auth, UserController.updatePreferences);
};
