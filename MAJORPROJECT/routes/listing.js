const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //for flow of errors in async functions ,better than try catch
const ExpressError = require("../utils/ExpressError.js");
const {listingSchemavalidate,reviewSchemavalidate} =require("../schema.js");
const Listing = require("../models/listing.js");

//for custom error message
const validateListing = (req, res, next) => {
  let {error}=listingSchemavalidate.validate(req.body)
  // console.log(result);  
  if(error){
    let errMsg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
} 


//index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  })
);

// NEW ROUTE new (synchronous render — do NOT wrap unless you make it async or change wrapAsync)
router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});

// POST NEW LISTING TO DATABASE
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    // const result  = listingSchemavalidate.validate(req.body);
    // if (result.error) {
    //   throw new ExpressError(400, result.error);
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
  })
);
// EDIT ROUTE
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  })
);
// FORCE UPDATE TO DATABASE
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//imp

// DELETE
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// SHOW 
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
  })
);







module.exports=router;