const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  time: { type: Number, required: true },
  imageSrc: { type: String, required: true },
  servings: { type: Number, required: true },
  ingrediants: { type: Array, required: true },
  description: { type: String, required: true },
  publisher: { type: String, required: true },
  userNameId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  identifiers: {
    type: String,
    required: true,
    // spicy: { type: Boolean, default: false },
    // sweet: { type: Boolean, default: false },
    // salty: { type: Boolean, default: false },
  },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
