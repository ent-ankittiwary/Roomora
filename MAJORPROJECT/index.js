const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); //for custom error message
const wrapAsync = require("./utils/wrapAsync.js"); //for flow of errors in async functions ,better than try catch
const methodOverride = require("method-override");
const {listingSchemavalidate,reviewSchemavalidate} =require("./schema.js");
const { error } = require("console");
const review=require("./models/review.js");
const Listing = require("./models/listing.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/listing.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// CONNECTION TO MONGODB WANDERLUST DATABASE
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => console.log("connection successful to mongodb"))
  .catch((err) => console.error(err));

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Hi! I am route");
});

//TO VALIDATE ALL SCHEMAS 


app.use("/listings",listings);
app.use("/listings/:id.reviews",reviews);
// INDEX

//ADDING REVIEW TO DATABASE (one listing can have many reviews)

//EDIT REVIEW ROUTE (optional)
// app.put("/listings/:id/reviews/:reviewId",validateReview,wrapAsync(async(req,res)=>{
//   let {id,reviewId}=req.params;
//   let updatereview=await review.findByIdAndUpdate(reviewId,{...req.body.review});
//   res.redirect(`/listings/${id}`);
// })
// );
//DELETE REVIEW ROUTE




// 404 fallback — use app.use to avoid any route parsing edge cases
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// global error handler
app.use((err, req, res, next) => {
  const { statusCode= 500, message="Something went wrong"} = err;
  res.status(statusCode).render("listing/error.ejs", { err });
//   const message = err.message || "Something went wrong!";
//   res.status(statusCode).send(message);
// res.send("page not found")
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
