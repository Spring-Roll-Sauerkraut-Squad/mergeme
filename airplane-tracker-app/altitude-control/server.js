import cors from'cors';
import express from 'express';
import mongoose from 'mongoose';
import AirportRoutes from './routes/AirportRoutes.js';
//require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
};

mongoose.connect(mongoURI, options)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
//app.use(cors());
app.use(express.json());
app.use('/api/airports', AirportRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});