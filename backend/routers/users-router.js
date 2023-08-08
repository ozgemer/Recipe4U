const express = require("express");
const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

router.patch("/update/:uid", usersController.updateUser);

router.delete("/delete/:id", usersController.deleteUser);

router.get("/findByName/:name", usersController.findByName);

module.exports = router;
