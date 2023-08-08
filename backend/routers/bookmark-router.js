const express = require("express");
const bookmarkController = require("../controllers/bookmark-controller");
const router = express.Router();

router.post("/add", bookmarkController.addRecipeToBookmark);

router.post("/delete", bookmarkController.deleteRecipeFromBookmark);

router.post("/search", bookmarkController.getBookmarkByFilters);

router.get("/get/:uid", bookmarkController.getBookmark);

module.exports = router;
