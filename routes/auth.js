const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const { validationResult, body } = require('express-validator')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
require('dotenv').config()
const fetchuser = require('../middleware/fetchuser')
router.post('/createuser', [
    body('name').isLength({ min: 3 }).withMessage('Name must be atleast 3 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be atleast 8 characters long')
], async (req, res) => {
    const errors = validationResult(req)
    let success = false
    let err = 1
    if (!errors.isEmpty()) {
        return res.json({ err: 1, errors: errors.array() })
    }

    try {
        let user = await User.findOne({
            email: req.body.email
        })
        if (user) {
            return res.json({ err: 2, message: 'Email already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            password: hashPassword,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id
            }
        }
        success = true
        const authToken = jwt.sign(data, process.env.JWT_KEY)
        res.json({ err: 3, message: 'User created successfully', jwtToken: authToken })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ err: 4, message: 'some error occured' })
    }

})
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
], async (req, res) => {

    const { password, email } = req.body
    try {
        let user = await User.findOne({ email })
        let success = false
        if (!user) {
            return res.json({success, message: 'Invalid email or password' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({success, message: 'Invalid email or password' })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_KEY)
        success=true
        res.json({ success, jwtToken: authToken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('some error occured')
    }
})
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})
module.exports = router