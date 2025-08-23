const User = require("../models/User.models");
const Auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const Note = require("../models/Notes.models");

module.exports = {
  testReg: (req, res) => {
    console.log("TESTING User Controller!!!");
    res.json({ msg: "Hi HRU" });
  },

  registerUser: (req, res) => {
    console.log("Registering", req.body);
    const { first, last, username, email, password } = req.body;
    User.findOne({ $or: [{ email }, { username }] }).then((existingUser) => {
      if (existingUser) {
        console.log("User already exsist");
        return res
          .status(400)
          .json({ msg: "User already exists. Please login" });
      } else if (!existingUser) {
        console.log("User IS NEW");

        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log("hash", hashedPassword);
        const newUser = new User({
          first: first,
          last: last,
          username: username,
          email: email,
          password: hashedPassword,
        });

        console.log("newUser", newUser);

        User.create(newUser)

          .then((created) => {
            console.log("created", created);

            created.save();

            res.status(201).json({
                msg: "User Registered Successfully",
                user: created,
              });
          })

          .catch((err) => {
            res
              .status(500)
              .json({ msg: "Error saving user", err: err.message });
          });
      }
    });
  },

  
  // loginUser: (req, res) => {
  //   console.log("Req body:", req.body);
  //   const { username, password } = req.body;
  //   User.findOne({ username: username }).then((user) => {
  //     console.log("user", user);

  //     if (!user) {
  //       return res.status(400).json({ msg: "Invalid Credentials" });
  //     } else {
  //       const match = bcrypt.compareSync(password, user.password);

  //       if (!match) {
  //         res.json({ msg: "bad password" });
  //       } else {
  //         const payload = {
  //           username: user.username,
  //           _id: user._id,
  //         };

  //         const token = JWT.sign(payload, process.env.SECRETKEY, {
  //           expiresIn: "1hr",
  //         });

  //         console.log("token", token);

  //         res
  //           .cookie("jwt", token, {
  //             httpOnly: true,
  //             secure: true,
  //             maxAge: 3600000,
  //           })
  //           .status(200)
  //           .json({ message: "Logged in successfully", token: token, user });
  //       }
  //     }
  //   });
  // },

loginUser: (req, res) => {
  const { username, password } = req.body;
  const userId = req.params.userId

  console.log('Login attempt:', req.body);
  console.log('userId: ', userId)

  // User.findOne({ username: username })
  User.findOne({ username })
  
    .then((user) => {
      console.log('User found:', user);

      if (!user) {
        return res.status(400).json({ msg: 'Invalid User credentials' });
      }

      const match = bcrypt.compareSync(password, user.password);

      if (!match) {
        return res.status(400).json({ msg: 'Invalid Login credentials' });
      }

      const payload = {
        username: user.username,
        _id: user._id,
      };
      const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      console.log('Generated JWT token:', token);

      res.cookie('jwt', token, {
        // httpOnly: true, 
        // secure: process.env.NODE_ENV === 'production',
        secure: false,
        maxAge: 3600000,
      });
      console.log('Received token from cookies: ', req.cookies.jwt)

      return res.status(200).json({ message: 'Logged in successfully', token: token, user: user });
    })
    .catch((err) => {
      console.error('Finding User error:', err.message);
      res.status(500).json({ msg: 'Server error', error: err.message });
    })
  },
 
  logoutUser: (req, res) => {
    res.clearCookie("authToken");
    res.status(200).json({ msg: "Logged out successfully" });
  },

  
  findUser: (req, res) => {
    console.log("fiiiiiindUser hi, req.params", req.params);
    User.findById(req.params.id).then((found) => {
      console.log("found", found);
      res.json(found);
    })
  },


  getUser: (req, res) => {
    console.log('User authenticated:', req.user);
    res.status(200).json(req.user)
    if (!req.params.id) {
      return res.status(400).json({msg: 'User ID is required'})
    }
  
    User.findById(req.params.id)
    .then((foundUser) => {
      console.log('User', foundUser)
      if (!foundUser) {
        return res.status(404).json({msg: 'User not found'})
      }
      setUser(foundUser)
      res.json(foundUser)
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).json({msg: 'Invalid User ID'})
      }
      console.error('getUser err catch', error.response || error.message)
      res.status(500).json({msg: 'Error getting user', err: error.response || error.message})
    })
  },

  }