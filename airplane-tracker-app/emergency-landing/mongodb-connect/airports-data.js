import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let AirportsModel; 

const extractAirports = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin',
    };
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI, options);
      console.log('Connected to MongoDB');
    }
    
    if (!AirportsModel) {
      AirportsModel = mongoose.model('Airports', new mongoose.Schema({}, { strict: false }));
    }

    const waypoints = await AirportsModel.find({})
    return waypoints;

  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export default extractAirports;
