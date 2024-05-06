const {sendMessage, getMessage} = require("../controllers/messageController");
const requireSignIn = require("../middlware/authentication");

const router = require("express").Router();

router.route("/send").post(requireSignIn,sendMessage);
router.route("/:id").post(requireSignIn,getMessage);

module.exports = router