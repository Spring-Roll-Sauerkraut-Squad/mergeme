import mongoose from 'mongoose';

const airspaceSchema = new mongoose.Schema({
    //convert floor ceiling to numbers
    name: String,
    floor: { type: Number, required: true },
    ceiling: { type: Number, required: true },
    geometry: {
        type: { type: String, enum: ['Polygon'], required: true },
        coordinates: { type: [[[Number]]], required: true }
    },
    properties: mongoose.Schema.Types.Mixed
});

//Geospatial Index 
airspaceSchema.index({ "geometry": "2dsphere" });

const Airspace = mongoose.model('Airspace', airspaceSchema);

export default Airspace;