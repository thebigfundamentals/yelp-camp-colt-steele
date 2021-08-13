const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', 
{useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection.eror:'));
db.once('open', () => {
    console.log('Database is open')
});

const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++){
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6107278c9ebe581b0cada094',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: `Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum`,
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dic4t7jdt/image/upload/v1628867735/YelpCamp/sz3n823zfo1bfyhsc7wx.jpg',
                  filename: 'YelpCamp/sz3n823zfo1bfyhsc7wx'
                },
                {
                  url: 'https://res.cloudinary.com/dic4t7jdt/image/upload/v1628867737/YelpCamp/yj3dmw8evu9ecrewg84s.jpg',
                  filename: 'YelpCamp/yj3dmw8evu9ecrewg84s'
                }
              ],
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});