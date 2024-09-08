//import './SampleData.json'
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const obj = require('./SampleData.json')
    res.json(obj)
  })

  module.exports=router