const User = require('../models/User.models');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

module.exports = {
  registerUser: (req, res) => {
    const { first, last, username, email, password } = req.body;

    User.findOne({ $or: [{ email }, { username }] })
      .then(existingUser => {
        if (existingUser) {
          return res.status(400).json({ msg: 'User already exists. Please login' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
          first,
          last,
          username,
          email,
          password: hashedPassword
        });

        User.create(newUser)
          .then(created => {
            res.status(201).json({
              msg: 'User Registered Successfully',
              user: {
                _id: created._id,
                username: created.username,
                first: created.first,
                last: created.last,
                email: created.email
              }
            });
          })
          .catch(err => {
            console.error('Error creating user:', err.message);
            res.status(500).json({ msg: 'Error saving user', error: err.message });
          });
      })
      .catch(err => {
        console.error('Error finding user:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
      });
  },

  loginUser: (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
      .then(user => {
        if (!user) {
          return res.status(400).json({ msg: 'Invalid User credentials' });
        }

        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
          return res.status(400).json({ msg: 'Invalid Login credentials' });
        }

        const payload = {
          username: user.username,
          _id: user._id
        };

        const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000
        });

        return res.status(200).json({
          message: 'Logged in successfully',
          token,
          user: {
            _id: user._id,
            username: user.username,
            first: user.first,
            last: user.last,
            email: user.email,
            preferences: user.preferences
          }
        });
      })
      .catch(err => {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
      });
  },

  logoutUser: (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ msg: 'Logged out successfully' });
  },

  getUser: (req, res) => {
    User.findById(req.user._id).select('-password')
      .then(foundUser => {
        if (!foundUser) {
          return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(foundUser);
      })
      .catch(error => {
        console.error('getUser error:', error.message);
        res.status(500).json({ msg: 'Error getting user', error: error.message });
      });
  },

  updatePreferences: (req, res) => {
    User.findByIdAndUpdate(
      req.user._id,
      { preferences: req.body },
      { new: true }
    ).select('-password')
      .then(updatedUser => {
        if (!updatedUser) {
          return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({
          msg: 'Preferences updated successfully',
          user: updatedUser
        });
      })
      .catch(err => {
        console.error('Error updating preferences:', err.message);
        res.status(500).json({ msg: 'Failed to update preferences', error: err.message });
      });
  }
};
