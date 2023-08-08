const HttpError = require("../models/httpError");
const BookmarkMongo = require("../models/bookmark");
const Recipe = require("../models/recipe");
const mongoose = require("mongoose");

//add recipe to bookmark
const addRecipeToBookmark = async (req, res, next) => {
  const { userId, recipeId } = req.body;
  let existingUser;
  //check if the user existing in the db
  try {
    existingUser = await BookmarkMongo.findOne({ user: userId });
  } catch (err) {
    const error = new HttpError("add recipe failed...1", 500);
    return next(error);
  }
  // user not exist
  let createdUser;
  if (!existingUser) {
    try {
      createdUser = new BookmarkMongo({
        user: userId,
        recipes: [],
      });
      existingUser = createdUser;
    } catch (err) {
      const error = new HttpError("add recipe failed, please try again", 500);
      return next(error);
    }
  } else {
    let existRecipe = existingUser.recipes.filter((r) => r === recipeId);
    console.log(existRecipe);
    if (existRecipe.length !== 0) {
      const error = new HttpError("recipe exist, please try again", 500);
      return next(error);
    }
  }
  //add recipe to recipes array
  existingUser.recipes = [...existingUser.recipes, recipeId];
  //update db
  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError("add recipe failed..2", 500);
    return next(error);
  }
  res.status(200).json({ user: existingUser.toObject({ getters: true }) });
};

//update
const deleteRecipeFromBookmark = async (req, res, next) => {
  const { userId, recipeId } = req.body;
  let existingUser;
  //check if the user existing in the db
  try {
    existingUser = await BookmarkMongo.findOne({ user: userId });
  } catch (err) {
    const error = new HttpError("add recipe failed", 500);
    return next(error);
  }
  //if user not found
  if (!existingUser) {
    const error = new HttpError("user not found", 404);
    return next(error);
  }
  // user exist
  const recipe = existingUser.recipes.filter((r) => r === recipeId);
  if (recipe) {
    try {
      existingUser.recipes.pull(recipeId);
      await existingUser.save();
    } catch (err) {
      const error = new HttpError("remove recipe failed", 500);
      return next(error);
    }
  } else {
    const error = new HttpError("recipe not found", 500);
    return next(error);
  }

  res.status(200).json({ user: existingUser.toObject({ getters: true }) });
};

const getBookmarkByFilters = async (req, res, next) => {
  const { identifier, title, servings } = req.body;
  let recipe;
  try {
    if (identifier === "none" && servings === 0) {
      recipe = await Recipe.find({
        title: { $regex: `${title}`, $options: "i" },
      });
    } else if (identifier === "none") {
      recipe = await Recipe.find({
        $and: [
          { title: { $regex: `${title}`, $options: "i" } },
          { servings: servings },
        ],
      });
    } else if (servings === 0) {
      recipe = await Recipe.find({
        $and: [
          { title: { $regex: `${title}`, $options: "i" } },
          { identifiers: identifier },
        ],
      });
    } else {
      recipe = await Recipe.find({
        $and: [
          { title: { $regex: `${title}`, $options: "i" } },
          { servings: servings },
          { identifiers: identifier },
        ],
      });
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a recipe.",
      500
    );
    return next(error);
  }
  if (!recipe || recipe.length === 0) {
    const error = new HttpError(
      "Could not find recipe for the provided data.",
      404
    );
    return next(error);
  }
  res.json({ recipe });
};

const getBookmark = async (req, res, next) => {
  const userId = req.params.uid;
  let existingUser;
  //check if the user existing in the db
  try {
    existingUser = await BookmarkMongo.findOne({ user: userId });
  } catch (err) {
    const error = new HttpError("get bookmark failed", 500);
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("user not exist", 500);
    return next(error);
  }

  res
    .status(200)
    .json({ user: existingUser.recipes.toObject({ getters: true }) });
};

exports.addRecipeToBookmark = addRecipeToBookmark;
exports.getBookmark = getBookmark;
exports.getBookmarkByFilters = getBookmarkByFilters;
exports.deleteRecipeFromBookmark = deleteRecipeFromBookmark;
