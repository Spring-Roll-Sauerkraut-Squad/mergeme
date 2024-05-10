import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const extractWaypoints = async (collectionName) => {
  try {
    const mongoURI = process.env.MONGO_URI 
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin',
    };

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI, options);
      console.log('Connected to MongoDB');
    }

 
    if (mongoose.models[collectionName]) {
      const WaypointModel = mongoose.model(collectionName);
      const waypoints = await WaypointModel.find({});
      return waypoints;
    } else {
      const WaypointModel = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
      const waypoints = await WaypointModel.find({});
      return waypoints;
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export default extractWaypoints;
