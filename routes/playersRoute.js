const { CreatePlayers, getAllPlayers, AddEventPlayersJoin, updatePlayer } = require("../controllers/playersControllers");


const router = require("express").Router();


router.get("/", getAllPlayers)
router.post("/", CreatePlayers)
router.post("/update" , updatePlayer)
// Players join event
router.post("/addeventjoin/:id", AddEventPlayersJoin)

module.exports = router;

