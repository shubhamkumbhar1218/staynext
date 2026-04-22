const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utility/wrapAsync");
const mongoose = require("mongoose");
const { isLogged, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controlers/listing.js");

//index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLogged, listingController.renderNewForm);

//create route
router.post("/", isLogged, upload.single("listing[image]"), validateListing, wrapAsync(listingController.create));

//show route
router.get("/:id", wrapAsync(listingController.show));

//Edit route
router.get("/:id/edit", isLogged, isOwner, wrapAsync(listingController.edit));

//Update route
router.put("/:id", isLogged, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.update));

//Delete route
router.delete("/:id", isLogged, isOwner, wrapAsync(listingController.delete));

module.exports = router;
