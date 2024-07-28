const joi = require('joi');

module.exports.validationSchema= joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        location: joi.string().required(),
        country: joi.string().required().min(0),
        filter: joi.string().required(),
        image: joi.string().allow("", null)
    }).required()
});

//review validate
module.exports.reviewSchema= joi.object({
    review: joi.object({
        rating: joi.number().required(),
        Comment: joi.string().required(),
    }).required(),
});