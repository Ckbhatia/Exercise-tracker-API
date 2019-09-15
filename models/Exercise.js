const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create exerciseSchema
const exerciseSchema = new Schema({
    username: {type: String, required: true},
    description: {type: String, required: true},
    duration: {type: String, required: true},
    date: { type: Date, default: Date.now }
    // user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {timestamps: true});

// Exercise
const Exercise = mongoose.model('Exercise', exerciseSchema);

// Exports the schema
module.exports = Exercise;