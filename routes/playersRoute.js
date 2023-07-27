const { createPlayers, getAllPlayers, updatePlayer, getPlayerById, } = require("../controllers/playersControllers");


const router = require("express").Router();


router.get("/", getAllPlayers)
router.get("/:id", getPlayerById)
router.post("/", createPlayers)
router.post("/update/:id" , updatePlayer)





module.exports = router;

