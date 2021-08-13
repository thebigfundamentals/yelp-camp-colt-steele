const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = {
    toJSON: {
        virtuals: true
    }
};

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 40)}...</p>`
});

// using a Mongoose Middleware to delete every review associate to a campground, when this campground is deleted

CampgroundSchema.post('findOneAndDelete', async function (doc) { // delete middleware, data is the document that was removed
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews //looking for the _id somewhere inside doc.reviews - mongoose operator!
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);