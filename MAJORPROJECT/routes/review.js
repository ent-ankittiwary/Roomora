const express=require("express");
const router=express.Router();
const ExpressError = require("../utils/ExpressError.js"); //for custom error message
const wrapAsync = require("../utils/wrapAsync.js"); //for flow of errors in async functions ,better than try catch
const {listingSchemavalidate,reviewSchemavalidate} =require("./schema.js");
const review=require("../models/review.js");
//FOR SERVER SIDE VALIDATION OF REVIEWS
const validateReview  = (req, res, next) => {
  let {error}=reviewSchemavalidate.validate(req.body)
  // console.log(result);  
  if(error){
    let errMsg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}

//post review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
 let listing=await Listing.findById(req.params.id);
  let newReview=new review(req.body.review);
  listing.reviews.push(newReview); 
  await newReview.save();
  await listing.save();
  console.log("new Review Saved");
  res.redirect(`/listings/${listing._id}`);
})
);

//deleting review route
 router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
})
);
module.exports=router;
