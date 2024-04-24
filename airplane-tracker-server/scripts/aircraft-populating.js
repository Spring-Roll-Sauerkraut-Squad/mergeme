const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoURI = process.env.MONGO_URI;
const csvAircraft = process.env.CSV_AIRCRAFT_DATA_PATH;

console.log('mongoURI', mongoURI);
console.log('csvAircraft', csvAircraft);
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
};

mongoose.connect(mongoURI, options);

const AircraftModel = mongoose.model('Aircraft', new mongoose.Schema({}, { strict: false }));
const batchSize = 1000;
let docs = [];
let insertPromise = null;

const readStream = fs.createReadStream(csvAircraft).pipe(csvParser());

readStream.on('data', async (row) => {
    docs.push(row);
    if (docs.length === batchSize) {
        readStream.pause();
        if (insertPromise) {
            await insertPromise;
        }
        insertPromise = AircraftModel.insertMany(docs.map(doc => new AircraftModel(doc)));
        docs = [];
        readStream.resume();
    }
});

readStream.on('end', async () => {
    if (insertPromise) {
        await insertPromise;
    }
    if (docs.length > 0) {
        await AircraftModel.insertMany(docs.map(doc => new AircraftModel(doc)));
    }
    if (insertPromise) {
        await insertPromise;
    }
    console.log('All data saved');
    mongoose.connection.close();
});