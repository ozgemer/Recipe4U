const express = require("express");
const recipeController = require("../controllers/recipe-controller");
const router = express.Router();

router.get("/", recipeController.getRecipe);

router.get("/identifiers", recipeController.getIdentifiers);

router.get("/fav", recipeController.getDefaultFavoriteRecipes);

router.get("/countIdentifier/:id", recipeController.getCountIdentifier);

router.post("/search", recipeController.getRecipeByFilters);

router.post("/myRecipe", recipeController.getRecipeByUserId);

router.patch("/update/:id", recipeController.updateRecipe);

router.post("/add", recipeController.addRecipe);

router.delete("/delete/:id", recipeController.deleteRecipe);

router.get("/:id", recipeController.getRecipeById);

router.get("/countRecipes/:id", recipeController.countRecipes);

router.post("/arrays", recipeController.getRecipesByArr);

router.post("/bookmarkArays", recipeController.getIdentifierByIdRecipes);

module.exports = router;
