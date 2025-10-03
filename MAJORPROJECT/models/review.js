//this will be one to many relationship as one listing can have many revies;
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
let review=mongoose.model("review",reviewSchema);
     //collection name=review(small r) //mongoose automatically makes it plural//creates reviews collection in db// put review comment in it.
module.exports=review; 