const HttpError = require("../models/httpError");
const Recipe = require("../models/recipe");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Log in failed, please try again", 500);
    return next(error);
  }

  //not in db// wrong password
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid data, could not log in", 401);
    return next(error);
  }
  res
    .status(200)
    .json({ message: "login", user: existingUser.toObject({ getters: true }) });
};

const signup = async (req, res, next) => {
  const { name, email, password, userName } = req.body;

  let existingUser;

  //check id the email existing in the db = user existing
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed ", 500);
    return next(error);
  }

  //email is existing

  if (existingUser) {
    const error = new HttpError(
      "User exists already (email), please login instead",
      422
    );
    return next(error);
  }

  // try {
  //   existingUser = await User.findOne({ userName: userName });
  // } catch (err) {
  //   const error = new HttpError("Signing up failed", 500);
  //   return next(error);
  // }

  // //email is existing

  // if (existingUser) {
  //   const error = new HttpError(
  //     "User exists already , please login instead",
  //     422
  //   );
  //   return next(error);
  // }

  const createdUser = new User({
    name,
    userName,
    email,
    password,
    recipes: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const updateUser = async (req, res, next) => {
  const { password } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot update user",
      500
    );
    return next(error);
  }

  user.password = password;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot update user (saving user)",
      500
    );
  }
  res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  let user;

  try {
    //find the relevant user from db
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete user",
      500
    );
    return next(error);
  }

  let recipes;
  let recipe;

  try {
    //find the relevant user from db
    recipes = await Recipe.find({ userNameId: userId });

    for (let i = 0; i < recipes.length; i++) {
      await recipes[i].remove();
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete user new",
      500
    );
    return next(error);
  }

  try {
    await user.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot delete user",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted user" });
};

const findByName = async (req, res, next) => {
  const name = req.params.name;
  let users;
  try {
    if (!name) name = "";
    users = await User.find({ name: { $regex: `${name}`, $options: "i" } });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any users.",
      500
    );
    return next(error);
  }
  res.json(users);
};

exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.findByName = findByName;
