const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., "medtech"
  name: { type: String, required: true }, // e.g., "Healthcare"
  description: String,
  icon: String, // Store the lucide-react icon name string (e.g., "HeartPulse")
  color: String, // CSS gradient string
  accent: String, // CSS class string
  categories: [String], // ["Diagnostics", "Robotics"]
});

module.exports = mongoose.model('Field', FieldSchema);