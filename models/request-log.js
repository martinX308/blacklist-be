const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const applicationSchema = new Schema({
  api:String,
  response:String,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const RequestLog = mongoose.model("RequestLog", applicationSchema);

module.exports = RequestLog;