const { response } = require("express");
const Listing = require("../models/listing");
const mongoose = require("mongoose");

//index route
module.exports.index = async (req, res) => {
    let listing = await Listing.find({});
    console.log(listing);

    res.render("listings/index", { listing });
};

//new form route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//create route
module.exports.create = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    if (!req.body.listing) {
        return res.send("Invalid listing data");
    }
    
    let data = req.body.listing;

    if(!data.title || data.title.trim() === ""){
    return res.send("Title is required");
}
    if(!data.description || data.description.trim() === ""){
    return res.send("Description is required");
}
    if(!data.price || data.price.trim() === ""){
    return res.send("Price is required");
}
    if(!data.location || data.location.trim() === ""){
    return res.send("Location is required");
}
    if(!data.country || data.country.trim() === ""){
    return res.send("Country is required");
}
if(!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
}

    let listing = new Listing(data);
    listing.image = { url, filename };
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "You're Created New Listing");

    res.redirect("/listing");
};

//show route
module.exports.show = async (req, res, next) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400, "Invalid Listing ID"));
    }

    let listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");

    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listing");
    }

    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

//edit route
module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listing");
    }

    let originalImage = listing.image.url;
    let originalImg = originalImage.replace("/upload", "/upload/w_250,e_blur:50");
    res.render("listings/edit", { listing, originalImg });
};

//update route
module.exports.update = async (req, res) => {
    let { id } = req.params;
    if(!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
    }
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success","listing is updated");
    res.redirect(`/listing/${id}`);
};

//delete route
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");

    res.redirect("/listing");
};

//post route for image upload
module.exports.uploadImage = async (req, res) => {
    res.send(req.file);
};

// search route
module.exports.search = async (req, res) => {
    let query = req.query.query?.trim();;

    if (!query) {
        console.log("NO QUERY");
        return res.redirect("/listing");
    }

    let filter = {
        country: { $regex: query, $options: "i" }
    };

    let results = await Listing.find(filter);

    res.render("listings/search", { results, query });
};
