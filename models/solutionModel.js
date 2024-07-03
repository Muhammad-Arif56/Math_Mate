const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const solutionSchema = new Schema({
  question: { type: String, required: true },
  result: { type: Schema.Types.Mixed, required: true },
  steps: [String],
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model('Solution', solutionSchema);
