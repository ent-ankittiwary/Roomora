//feeding data
const mongoose=require("mongoose");
const initData=require("./data.js"); // array of obect data;
const Listing=require("../models/listing.js"); //importing schema in collection
async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust") //wanderlust is database name
}
main()
.then(()=>{
        console.log("connection sucessful to mongodb");
})
.catch((err)=>{
    console.log(err);
});

const initDB= async () =>{
    await Listing.insertMany(initData.data); //feeding key:data in array of objects
    console.log("data was initialized");
}
initDB();