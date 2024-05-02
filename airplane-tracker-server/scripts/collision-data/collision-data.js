import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


let WaypointModel; 

const extractWaypoints = async () => {
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

    
    if (!WaypointModel) {
      WaypointModel = mongoose.model('Aircraft-waypoint', new mongoose.Schema({}, { strict: false }));
    }

    const waypoints = await WaypointModel.find({}).limit(50);

    return waypoints;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export default extractWaypoints;
