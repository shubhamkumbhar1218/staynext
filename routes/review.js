const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utility/wrapAsync");
const mongoose = require("mongoose");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview, isLogged, isAuthor } = require("../middleware");

const reviewController = require("../controlers/review.js");
//Post route
router.post("/", isLogged, validateReview, wrapAsync(reviewController.createReview));

//Delete reting route
router.delete("/:reviewId", isAuthor, isLogged, wrapAsync(reviewController.deleteReview));


module.exports = router;