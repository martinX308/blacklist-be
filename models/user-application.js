const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const applicationSchema = new Schema({
  applicationName: String,
  user: {
    type: ObjectId,
    ref: 'User'
  },
  apiKey:Object,
  apiSecret:Object
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const UserApplication = mongoose.model("UserApplication", applicationSchema);

module.exports = UserApplication;