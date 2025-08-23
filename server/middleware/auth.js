const express = require('express')
const bcrypt = require('bcrypt')
const JWT = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const User = require('../models/User.models')
const UserController = require('../controllers/User.controller')
const NotesController = require('../controllers/Notes.controllers')
const Notes = require('../models/Notes.models')

const Auth = (req, res, next) => {

  const token = req.cookies.jwt;

  console.log('Token received from cookies:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization not allowed' });
  }

  JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ msg: 'Invalid token' });
    }

    console.log('Token decoded:', decoded);
    req.user = decoded; 
    next(); 
  });
}

module.exports = Auth