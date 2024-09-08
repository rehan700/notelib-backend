const express = require('express')
const mongoose = require('mongoose')
const { validationResult, body } = require('express-validator')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Notes')
router.get('/fetchnotes', fetchuser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id })
  res.json(notes)
})
router.post('/addnote', fetchuser, [
  body('title').isLength({ min: 3 }).withMessage('Title must be atleast 3 characters'),
  body('description').isLength({ min: 1 }).withMessage('Description cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const { title, description, tag } = req.body
    const newNote = new Note({
      title, description, tag, user: req.user.id
    })
    const savedNote = await newNote.save()
    res.json(savedNote)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }

})
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body
    const newNote = {}
    if (title) {
      newNote.title = title
    }
    if (description) {
      newNote.description = description
    }
    if (tag) {
      newNote.tag = tag
    }
    let note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).send({ error: "Note not found" })
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({ error: "Action not allowed" })
    }
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json(note)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
})
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {

    let note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).send({ error: "Note not found" })
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({ error: "Action not allowed" })
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.send({ 'success': 'note deleted succesfully' })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router