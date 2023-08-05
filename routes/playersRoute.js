const { createPlayers, getAllPlayers, updatePlayer, getPlayerById, deletePlayerByID, } = require("../controllers/playersControllers");


const router = require("express").Router();


router.get("/", getAllPlayers)
router.get("/:id", getPlayerById)
router.post("/", createPlayers)
router.post("/update/:id" , updatePlayer)
router.post("/delete/:id" , deletePlayerByID)





module.exports = router;

