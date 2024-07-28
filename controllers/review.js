const listing = require("../models/listing.js"); //require listing schema which is set in models
const ExpressError= require("../utils/ExpressError.js");
const {reviewSchema}= require("../SchemaValidation.js");
const review = require("../models/review.js");

module.exports.createReview=async(req, res)=>{
    const result= reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }
    let listings = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author= req.user._id;
    listings.review.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success", "New Review added");
    res.redirect(`/listing/${listings._id}`);
};
module.exports.deleteReview=async(req,res)=>{
    let {id, reviewId}=req.params;
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listing/${id}`);
};