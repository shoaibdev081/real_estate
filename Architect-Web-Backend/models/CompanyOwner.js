const mongoose = require('mongoose');

const CompanyOwnerSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  role: { type: String, default: '' },
  quote: { type: String, required: true },
  image: { type: String, default: '' },
  logo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('CompanyOwner', CompanyOwnerSchema);
