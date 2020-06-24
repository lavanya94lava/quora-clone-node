
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
},{
    timestamps: true
});


const Question = mongoose.model('Question', questionSchema);

module.exports = Question