const Review = require("../models/review");
const mongoose = require("mongoose");
const Listing = require("../models/listing");

//post route
module.exports.createReview = async (req, res) => {
    let { id } = req.params;

    if (!req.body.review) {
        throw new ExpressError(400, "Please add a comment");
    }

    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","review added");
    res.redirect(`/listing/${id}`);
};

//delete route
module.exports.deleteReview = async(req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","review deleted");
    res.redirect(`/listing/${id}`);
};