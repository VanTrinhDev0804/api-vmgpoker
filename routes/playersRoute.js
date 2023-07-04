const { CreatePlayers, getAllPlayers, AddEventPlayersJoin } = require("../controllers/playersControllers");


const router = require("express").Router();


router.get("/", getAllPlayers)
router.post("/", CreatePlayers)

// Players join event
router.post("/addeventjoin/:id", AddEventPlayersJoin)

module.exports = router;

