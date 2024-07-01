const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const solutionSchema = new Schema({
  question: { type: String, required: true },
  result: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;
