const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
  user: { type: String, required: true },
  recipes: [{ type: String }],
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
