const express = require('express');

const router = express.Router();

const questionsController = require("../controllers/questions_controller");

router.post("/create", questionsController.createQuestion);
router.get("/delete/:id", questionsController.deleteQuestion);


module.exports = router;