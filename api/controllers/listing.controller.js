import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createListing = catchAsync(async (req, res, next) => {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
})

export const deleteListing = catchAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, 'Listing not found!'));
    if (listing.userRef !== req.user._id) return next(errorHandler(401, 'You can only delete your own listings!'));
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
})

export const updateListing = catchAsync(async (req, res, next)=> {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, 'Listing not found!'));
    if (listing.userRef!== req.user._id) return next(errorHandler(401, 'You can only update your own listings!'));
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedListing); 
})

export const getListing = catchAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, 'Listing not found!'));
    res.status(200).json(listing);
})

export const getListings = catchAsync(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined) {
        offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined) {
        furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined) {
        parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
        name:{ $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
    }).sort({ [sort]: order }).skip(startIndex).limit(limit);

    return res.status(200).json(listings);   
})
