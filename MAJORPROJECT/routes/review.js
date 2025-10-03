const express = require("express");
const router = express.Router({mergeParams: true}); //to include parameter in parent route
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchemavalidate} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// SERVER SIDE VALIDATION OF REVIEWS
const validateReview = (req, res, next) => {
  const { error } = reviewSchemavalidate.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(errMsg, 400); // message first, then status
  } else {
    next();
  }
};

// POST review route
router.post("/",validateReview,wrapAsync(async (req, res) => {
  console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

// DELETE review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId }=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
  await Review.findById(reviewId);
  res.redirect(`/listings/${id}`);
}))
module.exports=router;