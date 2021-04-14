const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const FollowerModel = require('../models/FollowerModel');
const jwt =require('jsonwebtoken');
const brypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

router.post('/', async(req,res) => {
    const {
        email,
        password,
    } = req.body.user;

    if(!isEmail(email)) return res.state(401).send('Invalid email');
    if(password.length < 6 ) return res.state(401).send('Password must be at least 6 characters');

    try{
        const user = await UserModel.findOne({email: email.toLowerCase()}).select('+password');
        if(!user){
            return res.status(401).send('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).send('Invalid credentails');
        }

        const payload = {userId: user._id};
        jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '2d'}, (err, token) => {
            if(err) throw err;
            res.status(200).json(token);
        });
    }catch(error) {
        console.error(error);
        return res.status(500).send('Server error')
    }
});

module.exports = router;

