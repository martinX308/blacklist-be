const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const applicationSchema = new Schema({
  application: {
    type: ObjectId,
    ref: 'UserApplication'
  },
  ddNumber:String,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const BlackistEntry = mongoose.model("BlackistEntry", applicationSchema);

module.exports = BlackistEntry;