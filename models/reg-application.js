const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const applicationSchema = new Schema({
  applicationName: String,
  user: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const RegApplication = mongoose.model("RegApplication", applicationSchema);

module.exports = RegApplication;