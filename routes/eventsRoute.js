const { createEvent, getAllEventPorker } = require("../controllers/eventsControllers");



const router = require("express").Router();


router.get("/", getAllEventPorker)
router.post("/", createEvent)

// // Players join event
// router.post("/addeventjoin/:id", AddEventPlayersJoin)

module.exports = router;