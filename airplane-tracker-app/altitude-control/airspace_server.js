import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import AirspaceRoutes from './routes/AirspaceRoutes.js';
import 'dotenv/config'

const app = express();
const airspace_server_port = process.env.AIRSPACE_MONGO_PORT || 5000;
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
app.use('/api/airspaces', AirspaceRoutes);
app.listen(airspace_server_port, () => console.log(`Server running on http://localhost:${airspace_server_port}/api/airspaces`));