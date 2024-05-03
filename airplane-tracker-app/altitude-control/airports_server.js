import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import AirportRoutes from './routes/AirportRoutes.js';
import 'dotenv/config'

const app = express();
const airport_server_port = process.env.AIRPORT_MONGO_PORT || 4000;

const mongoURI = process.env.MONGO_URI;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
};

mongoose.connect(mongoURI, options)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use(cors());
app.use(express.json());
app.use('/api/airports', AirportRoutes);

app.listen(airport_server_port, () => console.log(`Server running on http://localhost:${airport_server_port}/api/airports`));