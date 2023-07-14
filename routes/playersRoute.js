const { createPlayers, getAllPlayers, addEventPlayersJoin, updatePlayer, updateEventPlayersJoin, deleteEventPlayerJoin } = require("../controllers/playersControllers");


const router = require("express").Router();


router.get("/", getAllPlayers)
router.post("/", createPlayers)
router.post("/update/:id" , updatePlayer)
// Players join event
router.post("/addeventjoin/:id", addEventPlayersJoin)
router.post("/updateeventjoin/:id", updateEventPlayersJoin)

// Delete event players join 
router.post("/deleteeventjoin/:id", deleteEventPlayerJoin)




module.exports = router;

