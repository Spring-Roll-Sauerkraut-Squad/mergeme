import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import EmergencyAirportRoutes from './db-connection/routes/EmergencyAirportsRoutes.js';
import 'dotenv/config'

const app = express();
const emergency_landing_server_port = process.env.EMERGENCY_LANDING_MONGO_PORT || 3000;
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
app.use('/api/airports', EmergencyAirportRoutes);

app.listen(emergency_landing_server_port, () => console.log(`Server running on http://localhost:${emergency_landing_server_port}/api/airports`));