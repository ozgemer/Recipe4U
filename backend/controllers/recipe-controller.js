const HttpError = require("../models/httpError");
const getCoordsForAddress = require("../util/location");
const Recipe = require("../models/recipe");
const User = require("../models/user");
const mongoose = require("mongoose");
const uuidv4 = require("uuid").v4;

const identifiers = [
  "spicy",
  "sweet",
  "salty",
  "vegan",
  "vegeterian",
  "dairy",
  "gluten free",
  "none",
];
const DefaultFavoriteRecipes = [
  {
    imageSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQkm8s8JbMGJejw7OZMFu_Qmf4oPKTtNQ9sA&usqp=CAU",
    id: uuidv4(),
    title: "pizza",
    time: 3,
    servings: 3,
    ingrediants: [
      "0.5 cup bread flour",
      "2 lb oil",
      "3.5 tps dry active yeast",
    ],
    description: "homemade pizza",
    publisher: "Noy",
    link: "#",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
  },
  {
    imageSrc:
      "https://www.thechunkychef.com/wp-content/uploads/2016/02/Roasted-Garlic-Cream-Sauce-7-feat-500x375.jpg",
    id: uuidv4(),
    title: "Paste with cream sauce",
    time: 3,
    servings: 3,
    ingrediants: [
      "0.5 cup bread flour",
      "2 lb oil",
      "3.5 tps dry active yeast",
    ],
    description: "Paste with cream sauce",
    publisher: "Maya",
    link: "#",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
  },
  {
    imageSrc:
      "https://media-cdn.tripadvisor.com/media/photo-s/12/e2/7f/9b/hamburger-with-foie-gras.jpg",
    id: uuidv4(),
    title: "Kosher Burger",
    time: 3,
    servings: 3,
    ingrediants: [
      "0.5 cup bread flour",
      "2 lb oil",
      "3.5 tps dry active yeast",
    ],
    description: "Kosher Burger",
    publisher: "SAAR",
    link: "#",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
  },
  {
    imageSrc:
      "https://do94x2ubilg42sdsl48mfdqk-wpengine.netdna-ssl.com/wp-content/uploads/44890096345_3612433c15_b.jpg",
    id: uuidv4(),
    title: "Vegetarian sushi",
    time: 3,
    servings: 3,
    ingrediants: [
      "0.5 cup bread flour",
      "2 lb oil",
      "3.5 tps dry active yeast",
    ],
    description: "Vegetarian sushi",
    publisher: "Oz",
    link: "#",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
  },
];

const addRecipe = async (req, res, next) => {
  const {
    imageSrc,
    title,
    time,
    servings,
    ingrediants,
    description,
    publisher,
    userNameId,
    identifiers,
    address,
  } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdRecipe = new Recipe({
    title,
    time,
    imageSrc,
    servings,
    ingrediants,
    description,
    publisher,
    userNameId,
    identifiers,
    address,
    location: coordinates,
  });

  let user;
  try {
    user = await User.findById(userNameId);
  } catch (err) {
    const error = new HttpError(
      "Creating recipe failed, please try again 1",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Creating recipe failed, please try again 2",
      404
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdRecipe.save({ session: sess }); //create unique id to recipe
    user.recipes.push(createdRecipe);
    const recArr = user.recipes;
    await user.update({ recipes: recArr });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating recipe failed, please try again 3",
      500
    );
    return next(error);
  }

  res.status(200).json({ recipe: createdRecipe });
};

const updateRecipe = async (req, res, next) => {
  const {
    imageSrc,
    title,
    time,
    servings,
    ingrediants,
    identifiers,
    description,
  } = req.body;
  const recipeId = req.params.id;

  let recipe;
  try {
    recipe = await Recipe.findById(recipeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot update recipe",
      500
    );
    return next(error);
  }
  recipe.imageSrc = imageSrc;
  recipe.title = title;
  recipe.time = time;
  recipe.servings = servings;
  recipe.ingrediants = ingrediants;
  recipe.identifiers = identifiers;
  recipe.description = description;

  try {
    await recipe.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot update recipe (saving recipe)",
      500
    );
  }

  res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
};

const getRecipe = async (req, res, next) => {
  const recipe = await Recipe.find({});
  res.json({ recipe: recipe });
};

const getIdentifiers = (req, res, next) => {
  res.json({
    identifiers: identifiers,
  });
};
const countRecipes = async (req, res, next) => {
  const userId = req.params.id;
  let recipes;
  let counter = [0, 0];
  try {
    recipes = await Recipe.aggregate([
      {
        $group: {
          _id: "$userNameId",

          count: { $count: {} },
        },
      },
    ]);
  } catch (err) {}
  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i]._id == userId) {
      counter[0] = recipes[i].count;
    } else {
      counter[1] += recipes[i].count;
    }
  }
  res.json({ counter });
};

const getRecipeByUserId = async (req, res, next) => {
  const userId = req.body.userId;
  let recipe;
  try {
    recipe = await Recipe.find({ userNameId: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a recipe.",
      500
    );
    return next(error);
  }

  if (!recipe || recipe.length === 0) {
    res.status(404).send("Could not find recipe for the provided id.");
    return;
  }

  res.json({ recipe });
};

const getRecipeById = async (req, res, next) => {
  const recipeId = req.params.id;
  let recipe;
  try {
    recipe = await Recipe.findById(recipeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a recipe.",
      500
    );
    return next(error);
  }
  if (!recipe || recipe.length === 0) {
    const error = new HttpError(
      "Could not find recipe for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ recipe: recipe.toObject({ getters: true }) });
};
const getRecipesByArr = async (req, res, next) => {
  const recipeArr = req.body.bookmarks;
  let recipe;
  try {
    recipe = await Recipe.find({ _id: { $in: recipeArr } });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a recipe.",
      500
    );
    return next(error);
  }
  if (!recipe || recipe.length === 0) {
    const error = new HttpError(
      "Could not find recipe for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ recipe: recipe });
};
const getRecipeByFilters = async (req, res, next) => {
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

const deleteRecipe = async (req, res, next) => {
  const recipeId = req.params.id;
  let recipe;

  try {
    //find the relevant recipe from db
    recipe = await Recipe.findById(recipeId).populate("userNameId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete recipe",
      500
    );
    return next(error);
  }

  if (!recipe) {
    const error = new HttpError("Could not find recipe for this id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await recipe.remove({ session: sess });

    recipe.userNameId.recipes.pull(recipe); //remove the recipe from the user recipes array
    await recipe.userNameId.save({ session: sess }); //save after the changes
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete recipe",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted recipe" });
};

const getCountIdentifier = async (req, res, next) => {
  const userId = req.params.id;
  let counter = [];
  let recipe;

  try {
    for (let i = 0; i < identifiers.length; i++) {
      recipe = await Recipe.find({
        identifiers: identifiers[i],
        userNameId: userId,
      });

      if (!recipe || recipe.length === 0) {
        //there are not recipes
        counter[i] = 0;
      } else {
        counter[i] = recipe.length;
      }
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a recipe.",
      500
    );
    return next(error);
  }
  res.json({ counter: counter });
};
const getDefaultFavoriteRecipes = async (req, res, next) => {
  res.json({
    DefaultFavoriteRecipes: DefaultFavoriteRecipes,
  });
};

const getIdentifierByIdRecipes = async (req, res, next) => {
  const recipeArr = req.body.bookmarks;
  let favoriteRecipe = [];
  let counter = [0, 0, 0, 0, 0, 0, 0, 0];
  let recipe;
  try {
    recipe = await Recipe.find({ _id: { $in: recipeArr } });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a recipe.",
      500
    );
    return next(error);
  }
  if (!recipe || recipe.length === 0) {
    const error = new HttpError(
      "Could not find recipe for the provided id.",
      404
    );
  }
  try {
    for (let i = 0; i < recipe.length; i++) {
      for (let j = 0; j < identifiers.length; j++) {
        if (recipe[i].identifiers == identifiers[j]) {
          counter[j]++;
          break;
        }
      }
    }
  } catch (err) {}
  let indexLike = 0;
  let maximum = 0;
  for (let i = 0; i < counter.length; i++) {
    if (counter[i] >= maximum) {
      maximum = counter[i];
      indexLike = i;
    }
  }
  favoriteRecipe = await Recipe.find({ identifiers: identifiers[indexLike] });
  while (favoriteRecipe.length > 4) {
    favoriteRecipe.shift();
  }

  res.json({ favoriteRecipe });
};

exports.addRecipe = addRecipe;
exports.getIdentifiers = getIdentifiers;
exports.updateRecipe = updateRecipe;
exports.getRecipeByUserId = getRecipeByUserId;
exports.getRecipe = getRecipe;
exports.getRecipeByFilters = getRecipeByFilters;
exports.deleteRecipe = deleteRecipe;
exports.getCountIdentifier = getCountIdentifier;
exports.getRecipeById = getRecipeById;
exports.getDefaultFavoriteRecipes = getDefaultFavoriteRecipes;
exports.getRecipesByArr = getRecipesByArr;
exports.countRecipes = countRecipes;
exports.getIdentifierByIdRecipes = getIdentifierByIdRecipes;
