import express from 'express';
import mongoose from 'mongoose';
import AirportRoutes from './routes/AirportRoutes.js';

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = "mongodb://srh:fLwat1A3WAwrEtaNlSp@34.107.106.194:27017";

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
};

mongoose.connect(mongoURI, options)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/api/airports', AirportRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});