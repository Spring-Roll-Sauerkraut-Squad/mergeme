import mongoose from 'mongoose';

const airspaceSchema = new mongoose.Schema({
    name: String,
    FLOOR: String,
    CEILING: String,
    geometry: {
        type: { type: String, enum: ['Polygon'], required: true },
        coordinates: { type: [[[Number]]], required: true }
    },
    properties: mongoose.Schema.Types.Mixed
});

const Airspace = mongoose.model('Airspace', airspaceSchema);

export default Airspace;