const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");
const { MissingPasswordError } = require("passport-local-mongoose/dist/lib/errors");
const { required } = require("joi");

const listingSchema = new mongoose.Schema({
    title: String,
    description: String, 
    mobile: {
        type: String,
        default: "2345678900",
        required: true,
    },
    image: {
        url: {
        type: String,
        required: true,
        },
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findByIdAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: { $in: listing.reviews }});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
