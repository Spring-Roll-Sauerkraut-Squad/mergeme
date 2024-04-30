const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoURI = process.env.MONGO_URI;
const csvAirport = process.env.CSV_AIRPORT_DATA_PATH;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
};

mongoose.connect(mongoURI, options);

const AirportModel = mongoose.model('Airport', new mongoose.Schema({
    id: Number,
    ident: String,
    type: String,
    name: String,
    latitude_deg: Number,
    longitude_deg: Number,
    elevation_ft: Number,
    continent: String,
    iso_country: String,
    iso_region: String,
    municipality: String,
    scheduled_service: String,
    gps_code: String,
    iata_code: String,
    local_code: String,
    home_link: String,
    wikipedia_link: String,
    keywords: String
}));
const batchSize = 1000;
let docs = [];
let insertPromise = null;

const readStream = fs.createReadStream(csvAirport).pipe(csvParser());

readStream.on('data', async (row) => {
    docs.push(row);
    if (docs.length === batchSize) {
        readStream.pause();
        if (insertPromise) {
            await insertPromise;
        }
        insertPromise = AirportModel.insertMany(docs.map(doc => new AirportModel(doc)));
        docs = [];
        readStream.resume();
    }
});

readStream.on('end', async () => {
    if (insertPromise) {
        await insertPromise;
    }
    if (docs.length > 0) {
        await AirportModel.insertMany(docs.map(doc => new AirportModel(doc)));
    }
    if (insertPromise) {
        await insertPromise;
    }
    console.log('All data saved');
    mongoose.connection.close();
});