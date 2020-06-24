const mongoose = require("mongoose");
const Question = require("./question");

const topicSchema = new mongoose.Schema({
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }]
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic