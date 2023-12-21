import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name']
        },
        description: {
            type: String,
            required: [true, 'Please provide a description']
        },
        address: {
            type: String,
            required: [true, 'Please provide an address']
        },
        regularPrice: {
            type: Number,
            required: [true, 'Please provide a regular price']
        },
        discountPrice: {
            type: Number,
            required: [true, 'Please provide a discount price']
        },
        bathrooms: {
            type: Number,
            required: [true, 'Please provide a bathrooms']
        },
        bedrooms: {
            type: Number,
            required: [true, 'Please provide a bathrooms']
        },
        furnished:{
            type: Boolean,
            required: true,
        },
        parking:{
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            required: [true, 'Please provide a type']
        },
        offer:{
            type: Boolean,
            required: true,
        },
        imageUrls: {
            type: Array,
            required: [true, 'Please provide an image']
        },
        userRef:{
            type: String,
            required: [true, 'Please provide a userRef']
        },
    }, {timestamps: true}
)

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;