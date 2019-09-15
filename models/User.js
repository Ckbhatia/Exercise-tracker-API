const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// Schema
const Schema = mongoose.Schema;

// userSchema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    exercise: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
    // password: { type: String, required: true}
});

// Hash the password
// userSchema.pre('save', function(next) {
//     this.password = bcrypt.hashSync(this.password, 10);
//     next();
// });

// Create method verify password
// userSchema.methods.verPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// }

// Create instance of userSchema
const User = mongoose.model('User', userSchema);

// Exports
module.exports = User;