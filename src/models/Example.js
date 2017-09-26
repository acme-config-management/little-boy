import mongoose, { Schema } from 'mongoose';

// Schema for the example document.
const ExampleSchema = new Schema({
  servicename: String,
  message: String,
});

export default mongoose.model('Example', ExampleSchema);
