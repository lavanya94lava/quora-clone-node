 
//this file contains the user Schema

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required :true
    },
    description: {
        type: String
    },
    passwordToken: {
        type: String
    },
    tokenExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }],
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Answer'
    }],
    followedby: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Follow'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;