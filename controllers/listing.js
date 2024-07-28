const { fileLoader } = require("ejs");
const listing = require("../models/listing");
const {validationSchema}= require("../SchemaValidation.js");
const ExpressError= require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async(req,res)=>{
    const alllisting= await listing.find({});
    res.render("index.ejs",{alllisting});
};
module.exports.newListing=(req,res)=>{
    res.render("new.ejs");
};
module.exports.saveNewListing=async(req,res,next)=>{
    const result= validationSchema.validate(req.body);
    console.log(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    };

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
    const url= req.file.path;
    const fileName= req.file.filename;
    console.log(`${url}, ${fileName}`);
   
    let newlisting = new listing(req.body.listing);
    newlisting.owner= req.user._id;
    newlisting.image= {url, fileName};
    newlisting.geography=response.body.features[0].geometry;
    const save= await newlisting.save();
    req.flash("success", "New Listing created");
    res.redirect("/listing");
};
module.exports.indivisualListing=async(req,res)=>{
    let {id}= req.params;
    const onelisting= await listing.findById(id).populate({path: "review", populate:{path: "author"}}).populate("owner");
    if(!onelisting){
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listing");
    }
    res.render("show.ejs",{onelisting});
};
module.exports.editListing=async(req,res)=>{
    const {id}= req.params;
    const onelisting= await listing.findById(id);
    if(!onelisting){
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listing");
    }
    res.render("edit.ejs",{onelisting});
};
module.exports.saveEditListing=async(req,res)=>{
    const result= validationSchema.validate(req.body);
   
    if(result.error){
        throw new ExpressError(400, result.error);
    }
    else{
        let {id}= req.params;
        const newdata=req.body.listing;;
        let one = await listing.findByIdAndUpdate({_id:id}, {$set:newdata});
        if(typeof req.file !=="undefined"){
        const url=req.file.path;
        const fileName=req.file.filename; 
        one.image={url,fileName}
        one.save();
    }
        req.flash("success", "Listing Updated");
        res.redirect("/listing");
    }
};
module.exports.deleteListing=async(req,res)=>{
    let {id}= req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listing");
};
module.exports.filter=async(req,res)=>{
    const {filter}= req.query;
    const alllisting=await listing.find({filter:filter});
    res.render("index.ejs",{alllisting});
}