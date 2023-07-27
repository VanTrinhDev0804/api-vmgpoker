const { registerUser, login } = require("../controllers/authControllers");




const router = require("express").Router();


router.post("/register", registerUser)
router.post("/login",login)



module.exports = router;