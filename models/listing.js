const mongoose =require("mongoose");
const review = require("./review");
const schema= mongoose.Schema;
const listingschema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image:{
       url: String,
       filename: String
    },
    price: Number,
    location: String,
    country: String,
    review:[{
        type: schema.Types.ObjectId,
        ref: "review"
    }],
    owner:{
        type: schema.Types.ObjectId,
        ref: "user"
    },
    filter:{
      type: String,
      enum: ['trending','room', 'camping', 'iconic-cities', 'mountain','castle', 'sea-side', 'resort', 'dome', 'amazing-pools', 'tiny-homes', 'houseboat', 'tree-house', 'camper-van', 'tower-house'],
      require: true
    },
    geography: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },  
});
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await review.deleteMany({_id: {$in: listing.review}});
    }
});

const listing = mongoose.model("listing", listingschema);
module.exports = listing;
