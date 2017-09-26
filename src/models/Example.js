import mongoose, { Schema } from 'mongoose';

const ExampleSchema = new Schema({
  servicename: String,
  message: String,
});

export default mongoose.model('Example', ExampleSchema);
