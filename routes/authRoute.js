const { register, login, getUser } = require("../controllers/userController");
// const { login } = require("../controllers/userController");
const requireSignIn = require("../middlware/authentication");

const router = require("express").Router();
const express = require("express");
const app = express();
app.use(express.json());

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/users/:_id").get(getUser);

module.exports = router