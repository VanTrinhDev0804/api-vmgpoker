const { registerUser, login } = require("../controllers/authControllers");




const router = require("express").Router();


router.post("/register", registerUser)
router.post("/login",login)

// // Players join event
// router.post("/addeventjoin/:id", AddEventPlayersJoin)

module.exports = router;